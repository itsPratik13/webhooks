"use client";

import React from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  const params = useParams();

  const endpointId = React.useMemo(() => {
    if (!params?.id) return null;
    const id = Number(params.id);
    return isNaN(id) ? null : id;
  }, [params?.id]);

  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetWebHooksQuery(endpointId!, {
    skip: !endpointId,
    pollingInterval: 10000, // auto refresh every 10s
  });

  const [search, setSearch] = React.useState("");
  const [expandedRow, setExpandedRow] = React.useState<number | null>(null);

  const methodColors: Record<string, string> = {
    POST: "bg-green-200 text-green-800",
    GET: "bg-blue-200 text-blue-800",
    PUT: "bg-yellow-200 text-yellow-800",
    DELETE: "bg-red-200 text-red-800",
  };

  const formatJSON = (value: unknown) => {
    try {
      if (typeof value === "string") {
        return JSON.stringify(JSON.parse(value), null, 2);
      }
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  const sortedFilteredData = React.useMemo(() => {
    const filtered = data.filter((item: any) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    return [...filtered].sort(
      (a: any, b: any) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
  }, [data, search]);

  if (!endpointId) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Invalid endpoint ID
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading webhook responses...
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Webhook Responses
          </h1>
          <p className="text-sm text-muted-foreground">
            Endpoint ID: {endpointId}
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search responses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {sortedFilteredData.length === 0 ? (
        <div className="text-center py-16 border rounded-lg text-muted-foreground">
          No webhook responses found.
        </div>
      ) : (
        <div className="w-full overflow-x-auto border rounded-lg">
          <Table>
            <TableCaption>
              Latest webhook responses (auto-refresh every 10s)
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Processing Time</TableHead>
                <TableHead>Signature Valid</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedFilteredData.map((response: any) => (
                <React.Fragment key={response.id}>
                  <TableRow className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{response.id}</TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-md font-medium dark:text-neutral-800 ${
                          methodColors[response.method] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {response.method}
                      </span>
                    </TableCell>

                    <TableCell>{response.eventType || "-"}</TableCell>
                    <TableCell>{response.ip || "-"}</TableCell>
                    <TableCell>{formatDate(response.receivedAt)}</TableCell>
                    <TableCell>{response.statusCode ?? "-"}</TableCell>
                    <TableCell>{response.processingTime ?? "-"}</TableCell>
                    <TableCell>
                      {response.signatureValid == null
                        ? "-"
                        : response.signatureValid
                        ? "✅"
                        : "❌"}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setExpandedRow(
                            expandedRow === response.id ? null : response.id
                          )
                        }
                      >
                        {expandedRow === response.id ? "Hide" : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Row for Headers/Body */}
                  {expandedRow === response.id && (
                    <TableRow>
                      <TableCell colSpan={9} className="bg-muted/30 p-4">
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                          <div>
                            <h3 className="font-semibold mb-2">Headers</h3>
                            <pre className="bg-background border rounded-md p-3 overflow-auto max-h-96 text-xs whitespace-pre-wrap break-all">
                              {formatJSON(response.headers)}
                            </pre>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Body</h3>
                            <pre className="bg-background border rounded-md p-3 overflow-auto max-h-96 text-xs whitespace-pre-wrap break-all">
                              {formatJSON(response.body)}
                            </pre>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}