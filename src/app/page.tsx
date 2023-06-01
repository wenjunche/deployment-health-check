"use client";

import React from "react";
import { useEffect, useState } from "react";

import { FinEnvironmentData } from "@/components/FinEnvironment";
import { EndpointStatus, checkEndpoints } from "@/utils/endpoint";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEndpointsHealth } from "@/lib/use-endpoints-health";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const { toast } = useToast();
  const { endpointResponses, revalidate, addEndpoint, removeEndpoint } =
    useEndpointsHealth();
  const [showAddEndpointModal, setShowAddEndpointModal] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(endpointResponses));
      toast({
        title: "Copied to clipboard",
        description:
          "All endpoint information has been copied to your clipboard",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description:
          "Endpoint information could not be copied to your clipboard",
        variant: "destructive",
      });
    }
  };

  console.log(endpointResponses);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center pb-16">
        OpenFin Deployment Health Check
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <Card className="lg:col-span-3 p-4 bg-white rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              OpenFin Endpoints Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:mb-0 text-center lg:text-left">
              {endpointResponses.map((endpoint) => (
                <EndPointInfo
                  endpoint={endpoint}
                  key={endpoint.id}
                  onRemoveEndpoint={removeEndpoint}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-row gap-4">
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md"
                onClick={() => setShowAddEndpointModal(true)}
              >
                Add
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md"
                onClick={handleCopyToClipboard}
              >
                Copy to clipboard
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md"
                onClick={() => revalidate()}
              >
                Revalidate
              </button>
            </div>
          </CardContent>
        </Card>
        <FinEnvironmentData />
      </div>
      <div className="mb-32 mt-16 grid text-center lg:mb-0 lg:grid-cols-3 lg:text-left">
        <ExternalLinkCard
          url="https://openfin.co"
          title="OpenFin"
          description="View the OpenFin Website"
        />
        <ExternalLinkCard
          url="https://developers.openfin.co/of-docs/docs/workspace-overview"
          title="Workspace Docs"
          description="View the OpenFin Workspace Documentation"
        />
        <ExternalLinkCard
          url="https://developers.openfin.co/of-docs/docs/container-overview"
          title="Container Docs"
          description="View the OpenFin Container Documentation"
        />
        <AddEndpointModal
          isShowing={showAddEndpointModal}
          onClose={() => setShowAddEndpointModal(false)}
          onDoTheThing={addEndpoint}
        />
      </div>
    </main>
  );
}

const AddEndpointModal = ({
  isShowing,
  onClose,
  onDoTheThing,
}: {
  isShowing: boolean;
  onClose: () => void;
  onDoTheThing: (displayName: string, url: string) => void;
}) => {
  const [url, setUrl] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onDoTheThing(displayName, url);
    onClose();
  };

  return (
    <Dialog onOpenChange={onClose} open={isShowing}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new endpoint</DialogTitle>

          <DialogDescription>
            Add a new endpoint to the list of endpoints to check
          </DialogDescription>
        </DialogHeader>
        <form className="grid py-4 gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="display-name" className="text-right">
              Display Name
            </Label>
            <Input
              id="display-name"
              value={displayName}
              className="col-span-3"
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={url}
              className="col-span-3"
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          {/* <Input
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <Input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            /> */}
          <DialogFooter>
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md"
              type="submit"
            >
              Add
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EndPointInfo = ({
  endpoint,
  onRemoveEndpoint,
}: {
  endpoint: EndpointStatus;
  onRemoveEndpoint: (id: string) => void;
}) => {
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(endpoint));
      toast({
        title: "Copied to clipboard",
        description:
          "The endpoint information has been copied to your clipboard",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description:
          "The endpoint information could not be copied to your clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="group">
            <h3 className="font-bold">
              {endpoint.displayName}{" "}
              {!endpoint.loading && (endpoint.status ? "✅" : "❌")}
            </h3>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="p-4 w-100">
          <div className="space-y-2 flex flex-col items-start text-left">
            <div
              className="overflow-ellipsis overflow-hidden whitespace-nowrap"
              title={endpoint.url}
            >
              <strong>URL:</strong> {endpoint.url}
            </div>
            <div>
              <strong>Status:</strong> {endpoint.status ? "✅" : "❌"}
            </div>
            <div>
              <strong>Status Code:</strong> {endpoint.statusCode}
            </div>
            <div>
              <strong>Status Text:</strong> {endpoint.statusText || "None"}
            </div>
            <div className="flex flex-row mt-2 gap-4">
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md"
                onClick={handleCopyToClipboard}
              >
                Copy to clipboard
              </button>
              {endpoint.builtin ? null : (
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-md"
                  onClick={() => onRemoveEndpoint(endpoint.id)}
                >
                  Delete Endpoint
                </button>
              )}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

const ExternalLinkCard = ({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) => {
  return (
    <a
      href={url}
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2 className={`mb-3 text-2xl font-semibold`}>
        {title}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{description}</p>
    </a>
  );
};
