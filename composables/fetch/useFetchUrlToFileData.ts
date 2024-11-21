import axios from "axios";
import {
  // ENDPOINT_GRAPHQL,
  URL_B64URL,
} from "@/config";

// dlFileB64(data: JsonData!): JsonData!
// const Q_dlFileB64 = `query q_dlFileB64($data: JsonData!) { dlFileB64(data: $data) }`;

export const useFetchUrlToFileData = () => {
  const pc = useProcessMonitor();
  const file = async (url: string, filename?: string) => {
    let fdata;
    let file_;
    const filename_ = filename || `file:${idGen()}`;
    try {
      pc.begin();
      if (!isURL(url)) throw "--url-invalid";
      fdata = get(
        await axios({
          url: URL_B64URL,
          method: "POST",
          data: {
            url,
          },
          responseType: "text",
        }),
        "data"
      );
      file_ = new File([b64tob(fdata)], filename_, {
        type: mimetypeLookupImage(filename_),
      });
      console.log({ "@DEBUG:file_": file_ });
    } catch (error) {
      pc.setError(error);
    } finally {
      pc.done();
    }
    if (!pc.error.value) pc.successful();
    console.log({ "@DEBUG:file:error": pc.error.value });
    return file_;
  };

  return { file, processing: pc.processing };
};
