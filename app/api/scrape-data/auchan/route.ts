import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import jsonld from 'jsonld';

async function fetchJsonLd(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    await page.goto(url, { waitUntil: 'networkidle2' });

    const jsonLdScripts = await page.$$eval('script[type="application/ld+json"]', scripts =>
      scripts.map(script => script.innerHTML)
    );

    if (jsonLdScripts.length > 0) {
      const jsonLdDataArray = jsonLdScripts.map(script => JSON.parse(script));

      // Process each JSON-LD script
      const expandedDataArray = await Promise.all(jsonLdDataArray.map(data => jsonld.expand(data)));

      const offersData = expandedDataArray.flatMap(expandedData => 
        expandedData.flatMap(item => 
          Array.isArray(item['http://schema.org/offers']) ? item['http://schema.org/offers'].map((offer) => {
            console.log(item);
            if (offer && typeof offer === 'object') {
              const offerTyped = offer as { [key: string]: never };
              return {
                name: (item as { [key: string]: never })['http://schema.org/name']?.[0]?.['@value'],
                shops: [{
                  name: "Auchan",
                  link: url,
                  price: offerTyped['http://schema.org/price']?.[0]?.['@value'],
                }],
                image: (item as { [key: string]: never })['http://schema.org/image']?.[0]?.['@id'],
                priceCurrency: offerTyped['http://schema.org/priceCurrency']?.[0]?.['@value']
              };
            }
            return null;
          }).filter(offer => offer !== null) : []
        )
      );

      return offersData.length > 0 ? offersData[0] : {};
    } else {
      throw new Error('No JSON-LD script found');
    }
  } catch (error) {
    console.error('Error fetching JSON-LD:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const data = await fetchJsonLd(url);
    return NextResponse.json(data, { status: 200, headers: {'Access-Control-Allow-Origin': '*',} });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500, headers: {'Access-Control-Allow-Origin': '*',} });
  }
}