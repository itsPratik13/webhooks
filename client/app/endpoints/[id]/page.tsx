"use client";

import React from "react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ReplayResponse, useGetWebHooksQuery } from "@/app/state/api";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Filter, X } from "lucide-react";
import JsonView from "@microlink/react-json-view";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const [eventType, setEventType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [signatureFilter, setSignatureFilter] = useState<
    "valid" | "invalid" | "all"
  >("all");

  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [replayRow, setReplayRow] = useState<number | null>(null);
  const [replayUrl, setReplayUrl] = useState("");
  const [replayResponse, setReplayResponse] = useState<ReplayResponse | null>(
    null
  );

  const methodColors: Record<string, string> = {
    POST: "bg-green-200",
    DELETE: "bg-red-200",
    GET: "bg-blue-200",
    PUT: "bg-yellow-200",
    PATCH: "bg-purple-200",
    HEAD: "bg-gray-200",
    OPTIONS: "bg-orange-200",
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  const sortedFilteredData = React.useMemo(() => {
    return [...data]
      .filter((item: any) => {
        if (eventType && item.eventType !== eventType) return false;
        if (signatureFilter === "valid" && item.signatureValid !== true)
          return false;
        if (signatureFilter === "invalid" && item.signatureValid !== false)
          return false;
        if (startDate && new Date(item.receivedAt) < new Date(startDate))
          return false;
        if (endDate && new Date(item.receivedAt) > new Date(endDate))
          return false;

        return true;
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      );
  }, [data, eventType, signatureFilter, startDate, endDate]);

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
          {/* <Input
            placeholder="Search responses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 ring-none focus:ring-1 focus:ring-neutral-200 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-neutral-200 focus-visible:ring-offset-0 shadow-input"
          /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer" variant="outline">
                <Filter fill="white" className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              className="w-64 p-3 space-y-3"
            >
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium mb-1">Event Type</label>
                <Input
                  placeholder="e.g. push, payment_intent.succeeded"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="h-8 text-xs w-3/4"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium mb-1">
                  Select Signature Type
                </label>
                <Select
                  value={signatureFilter}
                  onValueChange={(value) =>
                    setSignatureFilter(value as "valid" | "invalid" | "all")
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Signature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="valid">Valid</SelectItem>
                      <SelectItem value="invalid">Invalid</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium mb-1">Start Date</label>
                <Input
                  placeholder="YYYY-MM-DD"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-8 text-xs w-3/4"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium mb-1">End Date</label>
                <Input
                  placeholder="YYYY-MM-DD"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-8 text-xs w-3/4"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs mt-1 cursor-pointer w-[100px]"
                onClick={() => {
                  setEventType("");
                  setSignatureFilter("all");
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Clear Filters
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="cursor-pointer w-[100px]"
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
                <TableHead className="text-right mr-2">Details</TableHead>
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
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          size="sm"
                          className="cursor-pointer w-[50px]"
                          variant="outline"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === response.id ? null : response.id
                            )
                          }
                        >
                          {expandedRow === response.id ? "Hide" : "View"}
                        </Button>
                        <Button
                          size="sm"
                          className="cursor-pointer w-[50px]"
                          variant="outline"
                          onClick={() =>
                            setReplayRow(
                              replayRow === response.id ? null : response.id
                            )
                          }
                        >
                          Replay
                        </Button>
                      </div>
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
                  {/*Replay Row */}
                  {replayRow === response.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/30 p-4">
                        <div className="w-full flex flex-col items-center gap-3">
                          <h3 className="text-sm font-medium text-center">
                            Replay Webhook
                          </h3>

                          <div className="w-full max-w-md flex items-center gap-2">
                            <Input
                              placeholder="Your server url or https://localhost:3000/"
                              value={replayUrl}
                              onChange={(e) => setReplayUrl(e.target.value)}
                              className="flex-1"
                            />

                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer shrink-0"
                              onClick={() => {}}
                            >
                              Send
                            </Button>
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
