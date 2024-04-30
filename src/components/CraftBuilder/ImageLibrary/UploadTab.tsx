import "./style.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import type { FilePondFile } from "filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { CheckIcon, ImagesIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ThemeImageType } from "@/craftPages/schemas/theming";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

interface Props {
  currentValue?: ThemeImageType;
  onImageSelect: (backgroundImage?: ThemeImageType) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const UploadTab = forwardRef<HTMLDivElement, Props>(
  function UploadTabForwardRef(props, ref) {
    const [uploadResultData, setuploadResultData] = useState<{
      errors: string[];
      messages: string[];
      result: { id: string; filename: string; uploaded: string };
      success: boolean;
    } | null>(null);

    const { onImageSelect, onCancel, onSave } = props;
    const [files, setFiles] = useState<FilePondFile[]>();

    const handleUpdateFiles = (fileItems: FilePondFile[]) => {
      // Set currently active file objects to this.state
      setFiles(fileItems);

      // create url to image
      const [file] = fileItems;
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target) return;

        const url = e.target.result as string;

        onImageSelect({
          source: "limbo",
          url,
        });
      };

      reader.readAsDataURL(file.file);
    };

    const handleSave = () => {
      onSave();
    };

    const handleCancel = () => {
      onCancel();
    };

    return (
      <div ref={ref}>
        <div className="flex-none flex justify-end gap-2 mb-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!uploadResultData}>
            Accept
            <CheckIcon className="ml-2 size-4" />
          </Button>
        </div>
        <FilePond
          files={files as unknown as File[]}
          onupdatefiles={handleUpdateFiles}
          allowMultiple={false}
          credits={false}
          onprocessfilerevert={() => {
            onImageSelect(undefined);
            setuploadResultData(null);
          }}
          onprocessfile={(error) => {
            if (error) {
              console.error(error);
              return;
            }

            if (uploadResultData) {
              onImageSelect({
                source: "upload",
                id: uploadResultData.result.id,
              });
            }
          }}
          server={{
            revert: async (uniqueFileId, load, error) => {
              setFiles([]);

              const response = await fetch(
                `/api/images/images/v1/${uniqueFileId}`,
                {
                  method: "DELETE",
                }
              );
              const result = await response.json();

              if (result.success) {
                load();
              } else {
                error("Delete failed");
              }
            },
            process: async (
              fieldName,
              file,
              metadata,
              load,
              error,
              progress,
              abort
            ) => {
              const directUpload: {
                errors: string[];
                messages: string[];
                result: { id: string; uploadURL: string };
                success: boolean;
              } = await fetch("/api/upload_url").then((res) => res.json());

              if (!directUpload.success) {
                error("Upload failed");
                return;
              }

              const formData = new FormData();
              formData.append("file", file);

              const upload = await fetch(directUpload.result.uploadURL, {
                method: "POST",
                body: formData,
              });

              const uploadResult: {
                errors: string[];
                messages: string[];
                success: boolean;
                result: {
                  id: string;
                  filename: string;
                  uploaded: string;
                };
              } = await upload.json();

              setuploadResultData(uploadResult);

              if (uploadResult.success) {
                load(uploadResult.result.id);
              } else {
                error("Upload failed");
              }

              return {
                abort: () => {
                  abort();
                },
              };
            },
          }}
          acceptedFileTypes={["image/png", "image/jpeg", "image/gif"]}
          name="files" /* sets the file input name, it's filepond by default */
          labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
        />
        <Alert variant="default" className="mt-2">
          <ImagesIcon className="size-4" />
          <AlertTitle>Upload image</AlertTitle>
          <AlertDescription>
            Maximum file size is 10MB. Allowed file types are JPG, PNG, and GIF.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
);
