const axios = require('axios');
var fs = require('fs')

//Helper function to fetch all content by type
async function fetchContentByType (type) {
  let res = await axios.get(`http://content.mastermnd.io/${type}`)
  return await res.data
} 

//Builds markdown Content for All learning Tracks
fetchContentByType('tracks').then(answer => {
  for (var i = 0;i < answer.length;i++) {
    var text = fs.readFileSync('./templates/template-track.md','utf8');

    let mapObj = {
      mmtitle: answer[i].title,
      mmheader: answer[i].heading,
      mmtagline: answer[i].tagline,
      mmdescription: answer[i].description,
      mmvideo: answer[i].video
    };
    
    text = text.replace(/mmtitle|mmheader|mmtagline|mmdescription|mmvideo/gi, function(matched) {
      return mapObj[matched];
    });
    
    let dirName = answer[i].title

    if (!fs.existsSync(`./courses/${dirName}`)){
      fs.mkdirSync(`./courses/${dirName}`);
    }

    writeMarkdown(`./courses/${dirName}/_index.md`, text)
  }

  fetchContentByType('tracksubcategories').then(answer => {
    for (var i = 0;i < answer.length;i++) {
      var text = fs.readFileSync('./templates/template-tracksubcategories.md','utf8');
  
      let mapObj = {
        mmtitle: answer[i].categorylabel,
        mmheader: answer[i].heading,
        mmtagline: answer[i].tagline,
        mmdescription: answer[i].description
      };
      
      text = text.replace(/mmtitle|mmheader|mmtagline|mmdescription/gi, function(matched) {
        return mapObj[matched];
      });
   
      let parentTrack = answer[i].tracks.title
      let dirName = answer[i].categorylabel
  
      if (!fs.existsSync(`./courses/${parentTrack}/${dirName}`)){
        fs.mkdirSync(`./courses/${parentTrack}/${dirName}`);
      }

      writeMarkdown(`./courses/${parentTrack}/${dirName}/_index.md`, text)
    }
  });

  fetchContentByType('trackmodules').then(answer => {
    for (var i = 0;i < answer.length;i++) {
      var text = fs.readFileSync('./templates/template-trackmodules.md','utf8');
  
      let mapObj = {
        mmtitle: answer[i].title,
        mmheader: answer[i].header,
        mmtagline: answer[i].tagline,
        mmdescription: answer[i].description,
        mmvideo: answer[i].video,
        mmweight: answer[i].weight
      };
      
      text = text.replace(/mmtitle|mmheader|mmtagline|mmdescription|mmvideo|mmweight/gi, function(matched) {
        return mapObj[matched];
      });
      
      let track = answer[i].tracks.title
      let subcategory = answer[i].tracksubcategories.categorylabel
      let trackModule = answer[i].title

  
      writeMarkdown(`./courses/${track}/${subcategory}/${trackModule}.md`, text)


    }
  });
});

function writeMarkdown (filePath, content) {
  fs.writeFile(filePath, content, (err) => {  
    if (err) throw err;
    console.log(filePath, 'saved!');
  });
}
