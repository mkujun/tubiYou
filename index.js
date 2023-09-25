const readline = require('readline');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const filePath = 'input.txt';

function openStream(line) {
  let id = line.substring(32, 43);

  if (id) {
    let stream = ytdl(id, {
      quality: 'highestaudio',
    });

    let start = Date.now();
    ffmpeg(stream)
      .audioBitrate(128)
      .save(`${__dirname}/${id}.mp3`)
      .on('progress', p => {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${p.targetSize}kb downloaded`);
      })
      .on('end', () => {
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
      });
  }
}

// Create a readable stream to read the file
const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

// Event handler for when data is read from the file
stream.on('data', (data) => {
  const lines = data.split('\n');

  // Process each line
  lines.forEach((line) => {
    //console.log(line);
    openStream(line);
  });
});

// Event handler for when the file has been completely read
stream.on('end', () => {
  console.log('File reading finished.');
});

// Event handler for handling errors
stream.on('error', (error) => {
  console.error('Error reading the file:', error);
});

