# ratopia-language-files
The language files for ratopia

All these files are from the [public sheet](https://docs.google.com/spreadsheets/d/1-YFJoSOUORWGb9t_1fuCmLqk7v3EzxdkhIVJQxnONkU/edit?gid=1221045797#gid=1221045797) given by the devs for translations.

## Important notes
* These files are not manually made or downloaded, these are made by running the sheet through a parser (found in the `parser` folder)
* The languages files can be found in the `language` folder
* All language files are parsed using the english translations as the values for the files

## How to run the parser
1. Download the [public language sheet](https://docs.google.com/spreadsheets/d/1-YFJoSOUORWGb9t_1fuCmLqk7v3EzxdkhIVJQxnONkU/edit?gid=1221045797#gid=1221045797) as a .xlsx file
2. Clone the repo
3. Run `pnpm dev`
4. Go to the url provided by vite (see console or visit the [default hosted site from vite](http://localhost:5173)) to go to the browser based parser
5. Select the downloaded in the file input
6. Click the `Parse` button and wait
7. The parsed files will automatically download
