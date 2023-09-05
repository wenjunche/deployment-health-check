type Endpoint = {
  id: string;
  url: string;
  displayName: string;
  builtin?: boolean;
};

export type EndpointStatus = Endpoint & {
  status: boolean;
  statusCode: number; // http status code
  statusText: string; // http status text
  loading: boolean;
};

const DEFAULT_END_POINTS: Endpoint[] = [
  {
    id: "OpenFin Licensing Server",
    url: "https://dl.openfin.co/version",
    displayName: "OpenFin Licensing Server",
    builtin: true,
  },
  {
    id: "OpenFin Installer Generator",
    url: "https://install.openfin.co/version",
    displayName: "OpenFin Installer Generator",
    builtin: true,
  },
  {
    id: "OpenFin Application Runner",
    url: "https://start.openfin.co/api/version",
    displayName: "OpenFin Application Runner",
    builtin: true,
  },
  {
    id: "OpenFin Diagnostics",
    url: "https://ingest.openfin.co/desktop-analytics/version",
    displayName: "OpenFin Diagnostics",
    builtin: true,
  },
  {
    id: "OpenFin CDN",
    url: "https://cdn.openfin.co/health/index.html",
    displayName: "OpenFin CDN",
    builtin: true,
  },
  {
    id: "OpenFin API Service",
    url: "https://of.os.openfin.co/api/version",
    displayName: "OpenFin API Service",
    builtin: true,
  },
  {
    id: "OpenFin Application Directory",
    url: "https://app-directory.openfin.co/version",
    displayName: "OpenFin Application Directory",
    builtin: true,
  },
  {
    id: "OpenFin Workspaces",
    url: "https://workspace.openfin.co/health/index.html",
    displayName: "OpenFin Workspaces",
    builtin: true,
  },
];

const pingWithoutCors = async (endpoint: Endpoint): Promise<boolean> => {
  //https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors

  return fetch(endpoint.url, { mode: "no-cors" })
    .then(() => true)
    .catch(() => false);
};

const ping = async (endpoint: Endpoint): Promise<EndpointStatus> => {
  const response: EndpointStatus = {
    ...endpoint,
    status: false,
    statusCode: 0,
    statusText: "",
    loading: false,
  };

  try {
    const resp = await fetch(endpoint.url, { cache: "no-cache" });
    response.status = resp.ok;
    response.statusCode = resp.status;
    response.statusText = resp.statusText;
  } catch (error) {
    const corsResponse = await pingWithoutCors(endpoint);
    if (corsResponse) {
      response.status = true;
      response.statusCode = 200;
      response.statusText = "Access has been blocked by CORS policy";
    } else {
      response.statusText = (error as Error).message;
    }
    console.error(error);
  }

  return response;
};

export const checkEndpoints = async (
  endpoints: Endpoint[] = DEFAULT_END_POINTS,
): Promise<EndpointStatus[]> => {
  return Promise.all(endpoints.map(ping));
};
