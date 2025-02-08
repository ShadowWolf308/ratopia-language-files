import { Button, FileInput, MantineProvider } from "@mantine/core";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react";
import { useCallback, useState } from "react";
import readXlsxFile, { readSheetNames } from "read-excel-file";

function downloadBlob(blob: Blob, name: string) {
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);

	link.download = name;
	link.href = url;

	document.body.appendChild(link);
	link.click();

	setTimeout(() => {
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	}, 0);
}

interface FileStructure {
	Array: {
		Key: any;
		Value?: string;
	}[];
}

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const parseXlsxSheet = useCallback(async (file: File, sheet: number): Promise<FileStructure> => {
		const rows = await readXlsxFile(file, {
			trim: false,
			sheet,
		});

		const headers = rows.shift();

		const keysRow = headers?.findIndex((header) => header.toString().toLowerCase().trim() === "keys") ?? 0;
		const englishRow = headers?.findIndex((header) => header.toString().toLowerCase().trim() === "english") ?? 1;

		const filledRows: { Key: string; Value: string }[] = [];

		for (const row of rows) {
			if (
				(row[keysRow] == null || row[keysRow].toString().trim() === "") &&
				(row[englishRow] == null || row[englishRow].toString().trim() === "")
			) {
				continue;
			}

			filledRows.push({
				Key: row[keysRow]?.toString() || "",
				Value: row[englishRow]?.toString() || "",
			});
		}

		return {
			Array: filledRows.map(({ Key, Value }) => {
				if (Key === "") {
					return {
						Key: {},
						Value,
					};
				}

				return {
					Key,
					Value,
				};
			}),
		};
	}, []);

	const parse = useCallback(async () => {
		setLoading(true);

		try {
			if (!file) {
				alert("No file selected");
				return;
			}

			if (!file.name.endsWith(".xlsx")) {
				alert("Invalid file type");
				return;
			}

			const sheetNames = await readSheetNames(file);

			const tasks: Promise<FileStructure>[] = [];

			for (const [index] of sheetNames.entries()) {
				tasks.push(parseXlsxSheet(file, index + 1));
			}

			const structures = await Promise.all(tasks);

			// NOTE - Files are downloaded one by one with a delay
			// This is to make sure all files are downloaded, there were issues with downloading multiple files at once or in quick succession
			for (const [index, structure] of structures.entries()) {
				downloadBlob(
					new Blob([JSON.stringify({ Array: structure }, null, 4)], {
						type: "application/json",
					}),
					`${sheetNames[index]}.json`,
				);

				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		} finally {
			setLoading(false);
		}
	}, [file, parseXlsxSheet]);

	return (
		<MantineProvider>
			<FileInput
				value={file}
				onChange={setFile}
				label="Language sheet file"
				accept=".xlsx"
			/>
			<Button
				onClick={parse}
				disabled={!file}
				loading={loading}
			>
				Parse
			</Button>
		</MantineProvider>
	);
}

export default App;
