# kac_unofficial
A Java/Maven program that scrapes score data from Google Sheets to create a player ranking table.

# Implementation
## Setup (If running on web server)
1. Upload the contents of html to a new directory on your web server.
1. Install java and maven onto your web server.
1. Modify App.java at the following points:
   - Line 29: Link to spreadsheet with free division scores
   - Line 43: Link to spreadsheet with women's division scores
   - Line 61: Link to where you want the scores to be saved. (kacstandings.js)
1. Upload the entire UnofficialKac folder to a directory on your web server
1. Using the command line, navigate to UnofficialKac directory and run the command "maven compile"
1. Run "bash unofficial.sh" to see if the program executes successfully
1. To automate this process, create a cron job such as:
   - 1,31 * * * * cd /srv/java/UnofficialKac && bash unofficial.sh
1. The rankings table should update automatically.

## Setup (If running locally)
1. Download the contents of html and UnofficialKac
1. Open the project in your preferred Java IDE (I used Eclipse)
1. Modify App.java at the following points:
   - Line 29: Link to spreadsheet with free division scores
   - Line 43: Link to spreadsheet with women's division scores
   - Line 61: Link to where you want the scores to be saved. (kacstandings.js)
1. Upon running the file, the kacstandings.js should update with the new scores. If you set Line 61 to the correct directory, the rankings should update each time you run the program.

## Contact
@_sessu on Twitter
