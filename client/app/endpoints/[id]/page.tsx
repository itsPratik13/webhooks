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
import { Check, X } from "lucide-react";
import JsonView from "@microlink/react-json-view";

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
    POST: "bg-green-200",
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
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );

    return [...filtered].sort(
      (a: any, b: any) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
  }, [data, search]);

  const IsSignatureValid = ({
    valid,
  }: {
    valid: boolean | null | undefined;
  }) => {
    if (valid === null || valid === undefined) {
      return <span className="text-xs text-muted-foreground">---</span>;
    }
    return valid ? (
      <span>
        <Check />
      </span>
    ) : (
      <span>
        <X />
      </span>
    );
  };
  const parseJSON = (value: string) => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value;
    } catch {
      return { raw: value };
    }
  };

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
            className="w-64 ring-none focus:ring-1 focus:ring-neutral-200 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-neutral-200 focus-visible:ring-offset-0 shadow-input"
          />
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="cursor-pointer"
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
                <TableHead>IP</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Signature</TableHead>
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

                    <TableCell>{response.ipAddress}</TableCell>

                    <TableCell>{formatDate(response.receivedAt)}</TableCell>
                    <TableCell>{response.eventType ?? "-"}</TableCell>
                    <TableCell>
                      <IsSignatureValid valid={response.signatureValid} />
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="cursor-pointer"
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

                  {/* Expandable Row */}
                  {expandedRow === response.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/30 p-4">
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                          <div
                            style={{
                              scrollbarWidth: "thin",
                            }}
                            className="overflow-y-auto max-h-96 border rounded-md p-3 scrollbar-thin"
                          >
                            <h3 className="font-semibold mb-2">Headers</h3>
                            <JsonView
                              src={parseJSON(response.headers)}
                              collapsed={1}
                              displayDataTypes={false}
                            />
                          </div>

                          <div
                            style={{ scrollbarWidth: "thin" }}
                            className="overflow-y-auto max-h-96 border rounded-md p-3"
                          >
                            <h3 className="font-semibold mb-2">Body</h3>

                            <div
                              style={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              <JsonView
                                src={parseJSON(response.body)}
                                collapsed={2}
                                displayDataTypes={false}
                                enableClipboard={false}
                              />
                            </div>
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
