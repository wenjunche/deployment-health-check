import { EndpointStatus, checkEndpoints } from "@/utils/endpoint";
import { useEffect, useState } from "react";

export const useEndpointsHealth = () => {
  const [endpointResponses, setEndpointResponses] = useState<EndpointStatus[]>(
    []
  );

  useEffect(() => {
    setEndpointResponses((r) =>
      r.map((endpoint) => ({ ...endpoint, loading: true }))
    );

    checkEndpoints().then(setEndpointResponses);
  }, []);

  const revalidate = async () => {
    setEndpointResponses((r) =>
      r.map((endpoint) => ({ ...endpoint, loading: true }))
    );
    const data = await checkEndpoints();
    setEndpointResponses(data);
  };

  return {
    revalidate,
    endpointResponses,
  } as const;
};
