"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusCircle, PlusIcon } from "lucide-react";
import { useDeleteEndpointsMutation, useGetEndpointsQuery } from "../state/api";
import CopyButton from "./CopyButton";
import { useState } from "react";
import HideButton from "./HideButton";
import TokenDisplay from "./TokenDisplay";
import ConfirmModal from "./ConfirmModal";

const EndpointsTable = () => {
  const { error, data, isLoading } = useGetEndpointsQuery();
  const [deleteEndpoint] = useDeleteEndpointsMutation();

  const [deletemodalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectId] = useState<number | null>(null);
  const handledeleteEndpoint = async (id: number) => {
    setSelectId(id);
    setDeleteModalOpen(true);
  };
  const confirmDeleteEndpoint = async () => {
    if (selectedId == null) return;
    try {
      await deleteEndpoint(selectedId).unwrap();
    } catch (error) {
      console.error("Failed to delete endpoint:", error);
    }
    setDeleteModalOpen(false);
    setSelectId(null);
  };
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectId(null);
  };
  if (isLoading) {
    return <div className="p-6 text-center">Loading endpoints...</div>;
  }
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load endpoints.
      </div>
    );
  }
  if (!data?.length) {
    return <div className="p-6 text-center">No endpoints found.</div>;
  }
  return (
    <div className="w-full  justify-between h-full p-6">
      <div className="flex  items-center justify-between mb-6">
        <h2 className="text-2xl text-center font-semibold mx-auto">
          Endpoints
        </h2>
        <button
          className="
        mb-1 px-2 py-2 border border-neutral-300 rounded-2xl flex gap-2
        cursor-pointer bg-neutral-100 hover:bg-neutral-200/50 transition-all duration-300
        dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-600
        shadow-md dark:shadow-md dark:shadow-neutral-600  dark:hover:shadow-none hover:shadow-none
        "
        >
          <PlusCircle className="size-4.5 mt-1 " />
          Add Endpoint
        </button>
      </div>

      <div className="max-w-full flex-1">
        <Table>
          <TableCaption>A list of your endpoints.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5 text-left">ID</TableHead>
              <TableHead className="w-1/5 text-left">Name</TableHead>
              <TableHead className="w-1/5 text-left">Endpoint URL</TableHead>
              <TableHead className="w-1/5 text-right">Created At</TableHead>
              <TableHead className="w-1/5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((endpoint) => (
              <TableRow key={endpoint.id} className="">
                <TableCell className="w-1/5 font-medium p-2">
                  {endpoint.id}
                </TableCell>
                <TableCell className="w-1/5 p-2">{endpoint.name}</TableCell>
                <TableCell className="w-1/5 p-2 ">
                  <TooltipProvider>
                    <TokenDisplay token={endpoint.token} />
                  </TooltipProvider>
                </TableCell>
                <TableCell className="w-1/5   text-right tracking-tight">
                  {new Date(endpoint.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="w-1/5 text-right ">
                  <TooltipProvider>
                    <div className="flex justify-end items-center gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 hover:scale-125 dark:bg-emerald-400 dark:hover:bg-emerald-300 transition-all duration-200 hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(52,211,153,0.6)] cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black">
                          View
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handledeleteEndpoint(endpoint.id)}
                            className=" w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 hover:scale-125 dark:bg-red-400  dark:hover:bg-red-400 transition-all duration-200 dark:hover:shadow-[0_0_8px_rgba(248,113,113,0.6)] cursor-pointer"
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          className="bg-neutral-800 text-white dark:bg-neutral-200 
dark:text-black"
                        >
                          Delete
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {deletemodalOpen && (
          <ConfirmModal
            open={deletemodalOpen}
            onConfirm={confirmDeleteEndpoint}
            onCancel={handleCancelDelete}
            message="Do you want to delete the endpoint ?"
          />
        )}
      </div>
    </div>
  );
};

export default EndpointsTable;
