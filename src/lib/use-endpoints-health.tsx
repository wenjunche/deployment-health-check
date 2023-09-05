import { EndpointStatus, checkEndpoints } from "@/utils/endpoint";
import { useEffect, useState } from "react";

export const useEndpointsHealth = () => {
  const [endpointResponses, setEndpointResponses] = useState<EndpointStatus[]>(
    [],
  );

  useEffect(() => {
    setEndpointResponses((r) =>
      r.map((endpoint) => ({ ...endpoint, loading: true })),
    );

    checkEndpoints().then(setEndpointResponses);
  }, []);

  const revalidate = async () => {
    setEndpointResponses((r) =>
      r.map((endpoint) => ({ ...endpoint, loading: true })),
    );
    const data = await checkEndpoints();
    setEndpointResponses(data);
  };

  const addEndpoint = async (endpointName: string, endpointUrl: string) => {
    console.log(endpointName, endpointUrl);

    const data = await checkEndpoints([
      {
        id: crypto.randomUUID(),
        displayName: endpointName,
        url: endpointUrl,
      },
    ]);
    setEndpointResponses((r) => [...r, data[0]]);
  };

  const removeEndpoint = async (endpointId: string) => {
    setEndpointResponses((r) =>
      r.filter((endpoint) => endpoint.id !== endpointId),
    );
  };

  return {
    revalidate,
    endpointResponses,
    addEndpoint,
    removeEndpoint,
  } as const;
};
