"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  UploadCloud,
  File as FileIcon,
  FileImage,
  FileText,
  FileVideo,
  MoreVertical,
  Download,
  Trash2,
  Filter,
  ArrowUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/formatters";

export type FileData = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
};

const initialFiles: FileData[] = [
  {
    id: "1",
    name: "Project-Proposal.pdf",
    type: "application/pdf",
    size: 2348201,
    uploadDate: new Date("2023-10-26T10:00:00Z").toISOString(),
  },
  {
    id: "2",
    name: "quarterly-report.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 876123,
    uploadDate: new Date("2023-10-25T14:30:00Z").toISOString(),
  },
  {
    id: "3",
    name: "website-hero-image.png",
    type: "image/png",
    size: 1204892,
    uploadDate: new Date("2023-10-24T09:15:00Z").toISOString(),
  },
  {
    id: "4",
    name: "product-demo.mp4",
    type: "video/mp4",
    size: 58203812,
    uploadDate: new Date("2023-10-22T18:00:00Z").toISOString(),
  },
  {
    id: "5",
    name: "archive.zip",
    type: "application/zip",
    size: 15728640,
    uploadDate: new Date("2023-10-20T11:45:00Z").toISOString(),
  },
];

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) {
    return <FileImage className="w-5 h-5 text-muted-foreground" />;
  }
  if (mimeType.startsWith("video/")) {
    return <FileVideo className="w-5 h-5 text-muted-foreground" />;
  }
  if (mimeType === "application/pdf") {
    return <FileText className="w-5 h-5 text-muted-foreground" />;
  }
  return <FileIcon className="w-5 h-5 text-muted-foreground" />;
};

const getFileTypeBadge = (mimeType: string) => {
  const simpleType = mimeType.split("/")[1]?.toUpperCase() || "FILE";
  return <Badge variant="outline">{simpleType}</Badge>;
};

export default function FileManagerPage() {
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null);

  const handleUploadComplete = (newFile: FileData) => {
    setFiles((prevFiles) => [newFile, ...prevFiles].sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
    setUploadOpen(false);
  };

  const handleDeleteFile = () => {
    if (fileToDelete) {
      setFiles((prevFiles) =>
        prevFiles.filter((f) => f.id !== fileToDelete.id)
      );
      setFileToDelete(null);
    }
  };

  const handleDownload = (file: FileData) => {
    // This is a mock download. In a real app, you'd trigger a file download.
    console.log(`Downloading ${file.name}...`);
    // In a real app:
    // const link = document.createElement('a');
    // link.href = `/api/download/${file.id}`; // an API route to serve the file
    // link.download = file.name;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline text-foreground">
              File Storage
            </h1>
            <p className="text-muted-foreground mt-1">
              An elegant space for your personal files.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Filter files">
              <Filter className="h-4 w-4" />
            </Button>
            <Button onClick={() => setUploadOpen(true)}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>
        </header>

        <main>
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] hidden sm:table-cell">
                        Icon
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="px-1">
                          Name <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Type
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <Button variant="ghost" className="px-1">
                          Size <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="px-1">
                          Date Added <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-[50px]">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.length > 0 ? (
                      files.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="hidden sm:table-cell">
                            {getFileIcon(file.type)}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {file.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getFileTypeBadge(file.type)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {formatBytes(file.size)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(file.uploadDate), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onSelect={() => handleDownload(file)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  <span>Download</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onSelect={() => setFileToDelete(file)}
                                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No files yet. Upload your first file!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <FileUploadDialog
        open={isUploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={handleUploadComplete}
      />

      <AlertDialog
        open={!!fileToDelete}
        onOpenChange={() => setFileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this file?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold text-foreground">
                {fileToDelete?.name}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFile}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
