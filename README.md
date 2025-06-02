# eIAM Frontend Migration

## How to run this project
### Run u5CMS

1. Download u5CMS with this link, and unzip into folder named `u5CMS` in project root:
https://yuba.ch/?c=u5cms&l=en
2. Run `docker compose -f local.docker-compose.yml up -d`
3. Go to http://localhost:8080/u5admin/
4. Login with user `Temp`, password `FirstPassword7`

### Insert updated HTML and CSS
1. Run `npm i` and `npm run build`
2. In the admin dashboard, select mode "S" on the right sidebar, and click "code"
![img.png](docs/ss1.jpg)
3. Select template `cssbase`, and paste content of file `r/cssbase.css` in this project and save.
4. Select template `htmltemplate`, and paste content of file `htmltemplate.html` in this project and save.

### Upload font and logo
#### Upload font
The client would like the font to be hosted internally. So we upload it using the u5CMS admin UI.


1. Go to the u5CMS instance and login 
2. Use this [instruction](https://yuba.ch/r/u5cmsmanualenglisch/u5cmsmanualenglisch_en.pdf#page=23) to upload the file `notosans_de.ttf` to the u5CMS instance
    - At step 3 in the instruction above, type in name `notosans` (instead of "cookbook")
    - Complete to step 4, upload file `r/notosans/notosans_de.ttf` as the German version of the file, no other versions is needed, they will all use this one.

#### Upload logo file
Please go through this [instruction](https://yuba.ch/r/u5cmsmanualenglisch/u5cmsmanualenglisch_en.pdf#page=15) to upload the logo.
1. At step 2 in the instruction above, click "show free images". The panel title should now be "free Images". This step is necessary because the default "std Images" mode will not allow SVGs.
2. At step 3, type in `eidgenossenschaft` for the name.
3. Complete to step 4, upload file `r/eidgenossenschaft/eidgenossenschaft_de.svg` as the German version of the file, no other versions is needed, they will all use this one.

All done, now your frontpage should look like http://eiam.deepsel.com/