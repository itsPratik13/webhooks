"use client";
import { useParams } from "next/navigation";
import { useGetWebHooksQuery } from "@/app/state/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Page() {
  const params = useParams();
  const endpointId = Number(params?.id);

  if (!params?.id) return <div>No endpoint specified</div>;
  if (isNaN(endpointId)) return <div>Invalid endpoint ID</div>;

  const { data, isLoading } = useGetWebHooksQuery(endpointId);

  if (isLoading)
    return <div className="p-6 text-center">Loading responses...</div>;
  if (!data || data.length === 0)
    return (
      <div className="p-6 text-center text-red-500">
        No webhooks found for this endpoint.
      </div>
    );

  return (
    <div>
      <div className="max-w-full flex-1 py-6">
        <Table>
          <TableCaption>A list of your webhook responses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/6 text-left">ID</TableHead>
              <TableHead className="w-1/6 text-left">Method</TableHead>
              <TableHead className="w-1/6 text-left">Headers</TableHead>
              <TableHead className="w-1/6 text-right">Body</TableHead>
              <TableHead className="w-1/6 text-right">Received At</TableHead>
              <TableHead className="w-1/6 text-right">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((response) => (
              <TableRow key={response.id} className="">
                <TableCell className="w-1/6 font-medium p-2">
                  {response.id}
                </TableCell>
                <TableCell className="w-1/6 p-2">{response.method}</TableCell>
                <TableCell className="w-1/6 p-2 ">{response.headers}</TableCell>
                <TableCell className="w-1/6  pl-2 text-right tracking-tight">{response.body}</TableCell>
                <TableCell className="w-1/6 text-right ">{new Date(response.receivedAt).toLocaleString()}</TableCell>
                <TableCell className="w-1/6 text-right ">{response.ip}</TableCell>
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
