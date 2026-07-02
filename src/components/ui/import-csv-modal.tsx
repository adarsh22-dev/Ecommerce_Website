"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileSpreadsheet, AlertCircle, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";

interface ColumnMapping {
  label: string;
  key: string;
  required?: boolean;
}

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  columns: ColumnMapping[];
  onSuccess?: (count: number) => void;
  sampleFile?: string;
}

export function ImportCsvModal({ isOpen, onClose, tableName, columns, onSuccess, sampleFile }: ImportCsvModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [previewErrors, setPreviewErrors] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    try {
      const Papa = (await import("papaparse")).default;
      const text = await file.text();
      const result = Papa.parse(text, { header: true, skipEmptyLines: true });

      if (result.errors.length > 0) {
        setPreviewErrors(result.errors.slice(0, 5).map((e: any) => `Row ${e.row}: ${e.message}`));
      }

      if (result.data.length === 0) {
        toast.error("CSV file is empty");
        return;
      }

      setHeaders(result.meta.fields || []);
      setParsedData(result.data.slice(0, 5));
      setSelectedFile(file);
      setPreviewErrors([]);

      const autoMap: Record<string, string> = {};
      for (const col of columns) {
        const match = result.meta.fields?.find(
          (f: string) => f.toLowerCase() === col.key.toLowerCase() || f.toLowerCase().includes(col.key.toLowerCase())
        );
        if (match) autoMap[col.key] = match;
      }
      setMapping(autoMap);
    } catch {
      toast.error("Failed to parse CSV file");
    }
  }, [columns]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleImport = async () => {
    if (!parsedData || !selectedFile) {
      toast.error("No file selected. Please choose a CSV file first.");
      return;
    }

    try {
      const Papa = (await import("papaparse")).default;

      const text = await selectedFile.text();
      const result = Papa.parse(text, { header: true, skipEmptyLines: true });
      const allData = result.data as Record<string, string>[];

      setImporting(true);
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      const recordsToImport: Record<string, any>[] = [];

      for (let i = 0; i < allData.length; i++) {
        const row = allData[i];
        const record: Record<string, any> = {};

        for (const col of columns) {
          const sourceKey = mapping[col.key];
          if (sourceKey && row[sourceKey] !== undefined && row[sourceKey] !== "") {
            let val: any = row[sourceKey];
            if (
              col.key === "price" ||
              col.key === "sale_price" ||
              col.key === "compare_price" ||
              col.key === "cost_price"
            ) {
              val = parseFloat(val);
            }
            if (col.key === "stock_quantity" || col.key === "sort_order") {
              val = parseInt(val, 10);
            }
            record[col.key] = val;
          }
        }

        const missing = columns.filter((c) => c.required && !record[c.key]);
        if (missing.length > 0) {
          errorCount++;
          errors.push(`Row ${i + 1}: Missing required fields (${missing.map((c) => c.label).join(", ")})`);
          continue;
        }

        recordsToImport.push(record);
      }

      const { importCsvRecords } = await import("@/lib/services/products");
      const fallbackResult = await importCsvRecords(tableName, recordsToImport);
      successCount = fallbackResult.successCount;
      errorCount = fallbackResult.errorCount;

      if (successCount > 0) {
        toast.success(`Imported ${successCount} records`);
        onSuccess?.(successCount);
        reset();
        onClose();
      }
      if (errorCount > 0) {
        if (successCount === 0) {
          toast.error(`All ${errorCount} records failed to import`);
        } else {
          toast.error(`${errorCount} records failed`);
        }
        setPreviewErrors(errors.slice(0, 10));
      }
    } catch (e: any) {
      toast.error(e?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setParsedData(null);
    setHeaders([]);
    setMapping({});
    setPreviewErrors([]);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }} title="Import CSV" size="lg">
      <div className="space-y-4">
        {!parsedData ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/20"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-primary/5 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop your CSV file here or click to browse
            </p>
            <p className="text-xs text-foreground-secondary">
              {columns.length} columns expected
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Column Mapping</span>
                <span className="text-xs text-foreground-secondary bg-muted px-2 py-0.5 rounded-full">
                  {selectedFile?.name}
                </span>
              </div>
              <button onClick={reset} className="text-xs text-foreground-secondary hover:text-foreground flex items-center gap-1">
                <X className="w-3 h-3" /> Change file
              </button>
            </div>

            <div className="space-y-2">
              {columns.map((col) => (
                <div key={col.key} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-32 flex-shrink-0">
                    {col.label} {col.required && <span className="text-destructive">*</span>}
                  </span>
                  <span className="text-foreground-secondary text-xs">→</span>
                  <select
                    value={mapping[col.key] || ""}
                    onChange={(e) => setMapping({ ...mapping, [col.key]: e.target.value })}
                    className="flex-1 h-9 px-3 border border-border rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">— Skip —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-3 py-2 border-b border-border">
                <span className="text-xs font-medium text-foreground-secondary">Preview (first 5 rows)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-3 py-2 font-medium text-foreground-secondary">#</th>
                      {headers.map((h) => (
                        <th key={h} className="text-left px-3 py-2 font-medium text-foreground-secondary whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.map((row: any, i: number) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 text-foreground-secondary">{i + 1}</td>
                        {headers.map((h) => (
                          <td key={h} className="px-3 py-2 text-foreground truncate max-w-[200px]">{row[h] || "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {previewErrors.length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-xs text-destructive max-h-32 overflow-y-auto">
                  {previewErrors.map((e, i) => <p key={i}>{e}</p>)}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <div>
                {sampleFile && (
                  <a
                    href={sampleFile}
                    download
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download sample CSV
                  </a>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => { reset(); onClose(); }}>Cancel</Button>
                <Button onClick={handleImport} loading={importing} className="shimmer-btn">
                  <Check className="w-4 h-4" /> Import
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
