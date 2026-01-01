'use server';

import * as cheerio from 'cheerio';

/**
 * Extracts the text content from a website.
 *
 * @param {string} url The URL of the website to extract content from.
 * @returns {Promise<string>} A promise that resolves to the text content of the website.
 */
export async function extractWebsiteContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    $('script, style, noscript, iframe, img, svg, header, footer, nav').remove();

    // Remove elements that are likely to be ads or otherwise irrelevant
    $('[class*="ads"], [id*="ads"], [class*="advert"], [id*="advert"]').remove();
    $('[class*="cookie"], [id*="cookie"]').remove();
    $('[class*="promo"], [id*="promo"]').remove();
    $('[class*="sidebar"], [id*="sidebar"]').remove();

    // Get the text from the body, which is a reasonable approximation of the main content
    let text = $('body').text();

    // Basic cleanup
    text = text
      .replace(/\s\s+/g, ' ') // Replace multiple spaces with a single space
      .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with a single newline
      .trim();

    // Limit the content to a reasonable length to avoid oversized prompts
    const max_length = 15000;
    if (text.length > max_length) {
      text = text.substring(0, max_length) + '...';
    }

    return text;
  } catch (error) {
    console.error('Error extracting website content:', error);
    if (error instanceof Error) {
      throw new Error(`Could not extract content from the URL: ${error.message}`);
    }
    throw new Error('An unknown error occurred while extracting website content.');
  }
}
