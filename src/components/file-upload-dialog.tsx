"use client";

import { useState, ChangeEvent } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import type { FileData } from "@/app/page";
import { formatBytes } from "@/lib/formatters";

type FileUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (file: FileData) => void;
};

export function FileUploadDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: FileUploadDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 5 + Math.random() * 10;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const newFile: FileData = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        uploadDate: new Date().toISOString(),
      };

      setTimeout(() => {
        onUploadComplete(newFile);
        handleClose();
      }, 500);
    }, 2500);
  };

  const handleClose = () => {
    if (isUploading) return;
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Upload a new file</DialogTitle>
          <DialogDescription>
            Select a file from your device to upload.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {!file ? (
            <div className="flex flex-col items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors border-border"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">
                      Click to upload
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Images, Videos, PDFs, etc.
                  </p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <div className="bg-muted p-4 rounded-lg flex items-center gap-4 relative">
                <FileIcon className="w-10 h-10 text-primary" />
                <div>
                  <p className="font-medium text-foreground truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-card hover:bg-muted"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="mt-6">
              <Progress value={uploadProgress} className="w-full h-2" />
              <p className="text-sm text-center mt-2 text-muted-foreground">
                Uploading...
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
