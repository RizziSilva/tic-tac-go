import { useLoading } from "@context";

export function useAsyncRequest() {
  const { setIsLoading } = useLoading();

  async function asyncRequest(request) {
    try {
      setIsLoading(true);
      return await request();
    } finally {
      setIsLoading(false);
    }
  }

  return { asyncRequest };
}
