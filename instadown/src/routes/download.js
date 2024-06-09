const express = require('express');
const puppeteer = require('puppeteer');

const router = express.Router();


// Function to get the video URL or download blob content
const getVideo = async (url) => {
    // launch a headless browser
    const browser = await puppeteer.launch();
    // create a new page
    const page = await browser.newPage();

    // Intercept network requests
    let videoURL = null;
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'media') {
            videoURL = request.url();
        }
        request.continue();
    });

    // Go to the URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Evaluate the page's content and extract the video URL
    if (!videoURL) {
        videoURL = await page.evaluate(() => {
            const videoElement = document.querySelector('video');
            return videoElement ? videoElement.src : null;
        });
    }

    // Close the browser
    await browser.close();

    // Return the video URL
    return videoURL;
};

router.post("/", async (req, res) => {
    console.log("request coming in...");

    try {
        // Call the getVideo function, wait for videoString and store it in the videoLink variable
        const videoLink = await getVideo(req.body.url);
        // If we get a videoLink, send the videoLink back to the user
        if (videoLink !== null) {
            res.json({ downloadLink: videoLink });
        } else {
            // If the videoLink is invalid, send a JSON response back to the user
            res.json({ error: "The link you have entered is invalid." });
        }
    } catch (err) {
        // Handle any issues with invalid links
        res.json({
            error: "There is a problem with the link you have provided."
        });
    }
});

module.exports = router;
