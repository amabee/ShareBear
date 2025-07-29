// Fastify-compatible multipart handler for multiple files
export const handleMultipart = async (request, reply) => {
  const contentType = request.headers["content-type"] || "";

  if (contentType.includes("multipart/form-data")) {
    try {
      console.log("Processing multipart request...");
      const data = {};
      const files = [];
      let totalSize = 0;
      const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB total
      const MAX_FILES = 10; // Limit number of files

      // Use Fastify's built-in multipart parsing
      for await (const part of request.parts()) {
        console.log("Processing part:", part.fieldname, part.type);

        if (part.type === "file") {
          // Check file count limit
          if (files.length >= MAX_FILES) {
            throw new Error(
              `Too many files. Maximum ${MAX_FILES} files allowed`
            );
          }

          // Validate image file
          const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
            "video/mp4",
            "video/mpeg",
            "video/quicktime",
          ];
          if (!allowedMimeTypes.includes(part.mimetype)) {
            throw new Error(
              `Invalid file type. Only images and videos are allowed. Got: ${part.mimetype}`
            );
          }

          // CRITICAL: Consume the file stream properly
          const buffer = await part.toBuffer();

          // Check individual file size (20MB per file)
          const MAX_INDIVIDUAL_SIZE = 20 * 1024 * 1024;
          if (buffer.length > MAX_INDIVIDUAL_SIZE) {
            throw new Error(
              `File "${part.filename}" is too large. Maximum size per file is 20MB`
            );
          }

          // Check total size
          totalSize += buffer.length;
          if (totalSize > MAX_TOTAL_SIZE) {
            throw new Error(
              `Total file size exceeds limit. Maximum total size is 100MB`
            );
          }

          files.push({
            fieldname: part.fieldname,
            originalname: part.filename,
            filename: part.filename,
            mimetype: part.mimetype,
            buffer: buffer,
            size: buffer.length,
            path: part.filename,
            encoding: part.encoding || "7bit",
          });

          console.log(
            `File processed: ${part.filename} (${(
              buffer.length /
              1024 /
              1024
            ).toFixed(2)}MB)`
          );
        } else {
          // Consume the field value
          data[part.fieldname] = part.value;
        }
      }

      console.log("Parsed data:", Object.keys(data));
      console.log(
        `Files found: ${files.length}, Total size: ${(
          totalSize /
          1024 /
          1024
        ).toFixed(2)}MB`
      );

      // Convert boolean strings to actual booleans
      if (data.allowsComments !== undefined) {
        data.allowsComments =
          data.allowsComments === "true" || data.allowsComments === true;
      }
      if (data.allowsShares !== undefined) {
        data.allowsShares =
          data.allowsShares === "true" || data.allowsShares === true;
      }

      // Attach the parsed data to the request
      request.body = data;
      request.files = files;
    } catch (error) {
      console.error("Multipart parsing error:", error);
      return reply
        .status(400)
        .send({ error: "Failed to parse multipart data: " + error.message });
    }
  }
};
