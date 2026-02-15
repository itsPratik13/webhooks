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
import { PlusCircle, PlusIcon } from "lucide-react";
import { useGetEndpointsQuery } from "../state/api";

const EndpointsTable = () => {
  const { error, data, isLoading } = useGetEndpointsQuery();
  if (isLoading) {
    return <div className="p-6 text-center">Loading endpoints...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">
      Failed to load endpoints.
    </div>;
  }
  return (
    <div className="w-full  justify-between h-full p-6">
      <div className="flex  items-center justify-between mb-6">
        <h2 className="text-2xl text-center font-semibold">Endpoints</h2>
        <button className="px-2 py-2 border border-neutral-200 rounded-2xl flex gap-2 cursor-pointer bg-neutral-100  hover:bg-neutral-200 transition-all duration-300 dark:bg-neutral-800 dark:hover:bg-neutral-700   dark:border-neutral-700">
          <PlusCircle className="size-4.5 mt-1 " />
          Add Endpoint
        </button>
      </div>

      <div className="max-w-full flex-1  ">
        <Table>
          <TableCaption>A list of your endpoints.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5 text-left">Id</TableHead>
              <TableHead className="w-1/5 text-left">Name</TableHead>
              <TableHead className="w-1/5 text-left">Token</TableHead>
              <TableHead className="w-1/5 text-right">Created At</TableHead>
              <TableHead className="w-1/5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
           {data?.map((endpoint)=>(
             <TableRow key={endpoint.id}>
             <TableCell className="w-1/5 font-medium">{endpoint.id}</TableCell>
             <TableCell className="w-1/5">{endpoint.name}</TableCell>
             <TableCell className="w-1/5">{endpoint.token}</TableCell>
             <TableCell className="w-1/5 text-right">{endpoint.createdAt}</TableCell>
             <TableCell className="w-1/5 text-right"></TableCell>
           </TableRow>
           ))}
           
           
           
           
           
           
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EndpointsTable;
