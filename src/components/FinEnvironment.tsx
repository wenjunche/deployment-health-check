"use client";

import { useEffect, useState } from "react";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { RVMInfo } from "@openfin/core/src/OpenFin";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "./ui/tooltip";

declare const fin:
  | import("@openfin/core/src/api/fin").FinApi<"window" | "view">
  | undefined;

function mapRvmInstallPathToReadablePath(path: string): string {
  const conversions: { [key: string]: string } = {
    "^C:\\\\Users\\\\[^\\\\]+\\\\AppData\\\\Local\\\\OpenFin$": "LocalAppData",
    "^C:\\\\Users\\\\[^\\\\]+\\\\AppData\\\\Roaming\\\\OpenFin$": "AppData",
    "^C:\\\\Program Files \\(x86\\)\\\\OpenFin$": "Program Files (x86)",
    "^C:\\\\Program Files\\\\OpenFin$": "Program Files",
    "^C:\\\\ProgramData\\\\OpenFin$": "ProgramData",
  };

  // strip leading OpenFin.exe if present
  if (path.endsWith("OpenFinRVM.exe")) {
    path = path.replace(/\\OpenFinRVM.exe$/, "");
  }

  for (const pattern of Object.keys(conversions)) {
    if (new RegExp(pattern).test(path)) {
      return conversions[pattern];
    }
  }

  return path;
}

export const FinEnvironmentData = () => {
  const { toast } = useToast();
  const [isFin, setIsFin] = useState<boolean>(false);
  const [availableRuntimes, setAvailableRuntimes] = useState<string[]>([]);
  const [currentRuntime, setCurrentRuntime] = useState<string>("");
  const [rvmInfo, setRvmVersion] = useState<RVMInfo | null>(null);
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
          setRvmVersion(rvmInfo);
          setIsFinsSupported(true);
        })
        .catch((err) => {
          console.error(err);
          setRvmVersion(null);
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
      rvmVersion: rvmInfo,
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
    <>
      <CardHeader className="pt-0">
        <CardTitle className="text-2xl font-semibold mt-0">
          OpenFin Info
        </CardTitle>
      </CardHeader>
      <CardContent>
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
        {rvmInfo && (
          <>
            <div className="font-medium text-lg mb-1">
              <strong>RVM Version:</strong> {rvmInfo.version}
            </div>
            <div className="font-medium text-lg mb-1">
              {/* <Tooltip */}
              <strong>RVM Path: </strong>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{mapRvmInstallPathToReadablePath(rvmInfo.path)}</span>
                  </TooltipTrigger>
                  <TooltipContent>{rvmInfo.path}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
        <div className="font-medium text-lg mb-1">
          <strong>OpenFin RVM Detected:</strong> {isFinsSupported ? "✅" : "❌"}
        </div>
        <div className="mt-4 flex flex-row gap-4">
          <button
            disabled={!isFinsSupported}
            onClick={() => {
              window.open(
                "fins://s3.amazonaws.com/ftp.openfin.co/Deployment/Deploymentapp.json",
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
    </>
  );
};
