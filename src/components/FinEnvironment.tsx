"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";

declare const fin:
  | import("@openfin/core/src/api/fin").FinApi<"window" | "view">
  | undefined;

export const FinEnvironmentData = () => {
  const { toast } = useToast();
  const [isFin, setIsFin] = useState<boolean>(false);
  const [availableRuntimes, setAvailableRuntimes] = useState<string[]>([]);
  const [currentRuntime, setCurrentRuntime] = useState<string>("");
  const [rvmVersion, setRvmVersion] = useState<string>("");
  const [isFinsSupported, setIsFinsSupported] = useState<boolean>(false);
  const [isFinsDetectionSupported, setIsFinsDetectionSupported] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof fin !== "undefined" && fin !== null) {
      setIsFin(true);
      fin.System.getVersion()
        .then((version) => {
          setCurrentRuntime(version);
        })
        .catch((err) => {
          console.error(err);
        });
      fin.System.getRvmInfo()
        .then((rvmInfo) => {
          setRvmVersion(rvmInfo.version);
        })
        .catch((err) => {
          console.error(err);
          setRvmVersion("Unknown");
        });
      fin.System.getInstalledRuntimes()
        .then((runtimes) => {
          setAvailableRuntimes(runtimes.map((runtime) => runtime));
        })
        .catch((err) => {
          console.error(err);
          setAvailableRuntimes(["Unknown"]);
        });
    }
  }, []);

  const checkForFinsProtocol = async () => {
    const result = { isFinsDetectionSupported: false, isFinsSupported: false };
    try {
      result.isFinsSupported = document.fonts.check("1em Inter-Fin");
      result.isFinsDetectionSupported = true;
    } catch (ex) {}
    return result;
  };

  useEffect(() => {
    checkForFinsProtocol().then((result) => {
      setIsFinsSupported(result.isFinsSupported);
      setIsFinsDetectionSupported(result.isFinsDetectionSupported);
    });
  }, []);

  const handleCopyToClipboard = async () => {
    const data = {
      currentRuntime,
      rvmVersion,
      availableRuntimes,
      isFinsSupported,
      isFinsDetectionSupported,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(data));
      toast({
        title: "Copied to clipboard",
        description: "The data has been copied to your clipboard.",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "The data could not be copied to your clipboard",

        variant: "destructive",
      });
    }
  };
  return (
    <Card className="lg:col-span-3 p-4 bg-white rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">OpenFin Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-medium text-lg mb-1">
          <strong>Running in an OpenFin Environment:</strong>{" "}
          {isFin ? "✅" : "❌"}
        </div>
        {currentRuntime && (
          <div className="font-medium text-lg mb-1">
            <strong>Current Runtime:</strong> {currentRuntime}
          </div>
        )}
        {!!availableRuntimes.length && (
          <div className="font-medium text-lg mb-1">
            <strong>Available Runtimes:</strong> {availableRuntimes.join(", ")}
          </div>
        )}
        {rvmVersion && (
          <div className="font-medium text-lg mb-1">
            <strong>RVM Version:</strong> {rvmVersion}
          </div>
        )}
        <div className="font-medium text-lg mb-1">
          <strong>OpenFin Fins Protocol Supported:</strong>{" "}
          {isFinsDetectionSupported ? "✅" : "❌"}
        </div>
        <div className="font-medium text-lg mb-1">
          <strong>OpenFin RVM Detected:</strong> {isFinsSupported ? "✅" : "❌"}
        </div>
        <div className="mt-4 flex flex-row gap-4">
          <button
            disabled={!isFinsSupported}
            onClick={() => {
              window.open(
                "fins://s3.amazonaws.com/ftp.openfin.co/Deployment/Deploymentapp.json"
              );
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Launch!
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Copy to Clipboard
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
