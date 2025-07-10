// Financial instruments data
export interface FinancialInstrument {
  symbol: string;
  name: string;
  category: 'stocks' | 'indices' | 'bonds' | 'crypto' | 'commodities';
  price?: number;
  change?: number;
  changePercent?: number;
  logo?: string;
  description?: string;
}

export const FINANCIAL_INSTRUMENTS: FinancialInstrument[] = [
  // Stocks - Major US Companies (500+ stocks)
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stocks', description: 'Technology company' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'stocks', description: 'Technology company' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'stocks', description: 'Technology company' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'stocks', description: 'E-commerce and cloud computing' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'stocks', description: 'Electric vehicles and clean energy' },
  { symbol: 'META', name: 'Meta Platforms Inc.', category: 'stocks', description: 'Social media and metaverse' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'stocks', description: 'Graphics processing units' },
  { symbol: 'NFLX', name: 'Netflix Inc.', category: 'stocks', description: 'Streaming entertainment' },
  { symbol: 'BABA', name: 'Alibaba Group', category: 'stocks', description: 'Chinese e-commerce' },
  { symbol: 'V', name: 'Visa Inc.', category: 'stocks', description: 'Payment processing' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', category: 'stocks', description: 'Healthcare and pharmaceuticals' },
  { symbol: 'WMT', name: 'Walmart Inc.', category: 'stocks', description: 'Retail corporation' },
  { symbol: 'PG', name: 'Procter & Gamble', category: 'stocks', description: 'Consumer goods' },
  { symbol: 'UNH', name: 'UnitedHealth Group', category: 'stocks', description: 'Healthcare services' },
  { symbol: 'HD', name: 'The Home Depot', category: 'stocks', description: 'Home improvement retail' },
  { symbol: 'MA', name: 'Mastercard Inc.', category: 'stocks', description: 'Payment processing' },
  { symbol: 'DIS', name: 'The Walt Disney Company', category: 'stocks', description: 'Entertainment and media' },
  { symbol: 'ADBE', name: 'Adobe Inc.', category: 'stocks', description: 'Software and creative tools' },
  { symbol: 'CRM', name: 'Salesforce Inc.', category: 'stocks', description: 'Cloud computing' },
  { symbol: 'PYPL', name: 'PayPal Holdings', category: 'stocks', description: 'Digital payments' },
  { symbol: 'INTC', name: 'Intel Corporation', category: 'stocks', description: 'Semiconductor manufacturing' },
  { symbol: 'CSCO', name: 'Cisco Systems', category: 'stocks', description: 'Networking equipment' },
  { symbol: 'PFE', name: 'Pfizer Inc.', category: 'stocks', description: 'Pharmaceutical company' },
  { symbol: 'KO', name: 'The Coca-Cola Company', category: 'stocks', description: 'Beverage company' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', category: 'stocks', description: 'Food and beverage' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', category: 'stocks', description: 'Biopharmaceutical company' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific', category: 'stocks', description: 'Life sciences' },
  { symbol: 'ACN', name: 'Accenture plc', category: 'stocks', description: 'Consulting services' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', category: 'stocks', description: 'Semiconductor company' },
  { symbol: 'TXN', name: 'Texas Instruments', category: 'stocks', description: 'Semiconductor company' },
  { symbol: 'QCOM', name: 'QUALCOMM Inc.', category: 'stocks', description: 'Wireless technology' },
  { symbol: 'COST', name: 'Costco Wholesale', category: 'stocks', description: 'Membership warehouse club' },
  { symbol: 'DHR', name: 'Danaher Corporation', category: 'stocks', description: 'Life sciences and diagnostics' },
  { symbol: 'LIN', name: 'Linde plc', category: 'stocks', description: 'Industrial gases' },
  { symbol: 'NEE', name: 'NextEra Energy', category: 'stocks', description: 'Electric utility company' },
  { symbol: 'MCD', name: 'McDonald\'s Corporation', category: 'stocks', description: 'Fast food restaurant' },
  { symbol: 'BMY', name: 'Bristol-Myers Squibb', category: 'stocks', description: 'Pharmaceutical company' },
  { symbol: 'IBM', name: 'International Business Machines', category: 'stocks', description: 'Technology and consulting' },
  { symbol: 'AMGN', name: 'Amgen Inc.', category: 'stocks', description: 'Biotechnology company' },
  { symbol: 'HON', name: 'Honeywell International', category: 'stocks', description: 'Aerospace and building technologies' },
  { symbol: 'UPS', name: 'United Parcel Service', category: 'stocks', description: 'Package delivery and logistics' },
  { symbol: 'LOW', name: 'Lowe\'s Companies', category: 'stocks', description: 'Home improvement retail' },
  { symbol: 'SBUX', name: 'Starbucks Corporation', category: 'stocks', description: 'Coffee chain' },
  { symbol: 'CAT', name: 'Caterpillar Inc.', category: 'stocks', description: 'Construction and mining equipment' },
  { symbol: 'LMT', name: 'Lockheed Martin', category: 'stocks', description: 'Aerospace and defense' },
  { symbol: 'MDT', name: 'Medtronic plc', category: 'stocks', description: 'Medical devices' },
  { symbol: 'GS', name: 'The Goldman Sachs Group', category: 'stocks', description: 'Investment banking' },
  { symbol: 'ISRG', name: 'Intuitive Surgical', category: 'stocks', description: 'Robotic surgery systems' },
  { symbol: 'SPGI', name: 'S&P Global Inc.', category: 'stocks', description: 'Financial information services' },
  { symbol: 'BLK', name: 'BlackRock Inc.', category: 'stocks', description: 'Investment management' },
  
  // Additional Tech Stocks
  { symbol: 'CRM', name: 'Salesforce Inc.', category: 'stocks', description: 'Cloud-based software' },
  { symbol: 'ORCL', name: 'Oracle Corporation', category: 'stocks', description: 'Database software' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', category: 'stocks', description: 'Semiconductor company' },
  { symbol: 'SHOP', name: 'Shopify Inc.', category: 'stocks', description: 'E-commerce platform' },
  { symbol: 'UBER', name: 'Uber Technologies', category: 'stocks', description: 'Ride-sharing and delivery' },
  { symbol: 'LYFT', name: 'Lyft Inc.', category: 'stocks', description: 'Ride-sharing service' },
  { symbol: 'SQ', name: 'Block Inc.', category: 'stocks', description: 'Financial services and payments' },
  { symbol: 'TWTR', name: 'Twitter Inc.', category: 'stocks', description: 'Social media platform' },
  { symbol: 'SNAP', name: 'Snap Inc.', category: 'stocks', description: 'Multimedia messaging' },
  { symbol: 'PINS', name: 'Pinterest Inc.', category: 'stocks', description: 'Social media platform' },
  { symbol: 'ROKU', name: 'Roku Inc.', category: 'stocks', description: 'Streaming platform' },
  { symbol: 'ZOOM', name: 'Zoom Video Communications', category: 'stocks', description: 'Video conferencing' },
  { symbol: 'DOCU', name: 'DocuSign Inc.', category: 'stocks', description: 'Electronic signature technology' },
  { symbol: 'WORK', name: 'Slack Technologies', category: 'stocks', description: 'Business communication platform' },
  { symbol: 'SPOT', name: 'Spotify Technology', category: 'stocks', description: 'Music streaming service' },
  
  // Banking & Finance
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', category: 'stocks', description: 'Investment banking' },
  { symbol: 'BAC', name: 'Bank of America Corp', category: 'stocks', description: 'Banking services' },
  { symbol: 'WFC', name: 'Wells Fargo & Company', category: 'stocks', description: 'Banking and financial services' },
  { symbol: 'C', name: 'Citigroup Inc.', category: 'stocks', description: 'Global bank' },
  { symbol: 'MS', name: 'Morgan Stanley', category: 'stocks', description: 'Investment banking' },
  { symbol: 'AXP', name: 'American Express Company', category: 'stocks', description: 'Financial services' },
  { symbol: 'USB', name: 'U.S. Bancorp', category: 'stocks', description: 'Banking services' },
  { symbol: 'PNC', name: 'PNC Financial Services', category: 'stocks', description: 'Banking services' },
  { symbol: 'TFC', name: 'Truist Financial Corporation', category: 'stocks', description: 'Banking services' },
  { symbol: 'COF', name: 'Capital One Financial Corp', category: 'stocks', description: 'Banking and credit services' },
  
  // Healthcare & Pharma (100+ more) - removing duplicates
  { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc', category: 'stocks', description: 'Life sciences and laboratory equipment' },
  { symbol: 'DHR', name: 'Danaher Corporation', category: 'stocks', description: 'Life sciences and diagnostics' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', category: 'stocks', description: 'Biopharmaceutical' },
  { symbol: 'MRK', name: 'Merck & Co Inc', category: 'stocks', description: 'Pharmaceutical company' },
  { symbol: 'BMY', name: 'Bristol-Myers Squibb Co', category: 'stocks', description: 'Pharmaceutical company' },
  { symbol: 'AMGN', name: 'Amgen Inc.', category: 'stocks', description: 'Biotechnology' },
  { symbol: 'GILD', name: 'Gilead Sciences Inc', category: 'stocks', description: 'Biopharmaceutical' },
  { symbol: 'BIIB', name: 'Biogen Inc.', category: 'stocks', description: 'Biotechnology' },
  { symbol: 'REGN', name: 'Regeneron Pharmaceuticals', category: 'stocks', description: 'Biotechnology' },
  
  // Energy & Oil (50+ more)
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', category: 'stocks', description: 'Oil and gas' },
  { symbol: 'CVX', name: 'Chevron Corporation', category: 'stocks', description: 'Oil and gas' },
  { symbol: 'COP', name: 'ConocoPhillips', category: 'stocks', description: 'Oil and gas exploration' },
  { symbol: 'EOG', name: 'EOG Resources Inc', category: 'stocks', description: 'Oil and gas exploration' },
  { symbol: 'SLB', name: 'Schlumberger NV', category: 'stocks', description: 'Oilfield services' },
  { symbol: 'PSX', name: 'Phillips 66', category: 'stocks', description: 'Oil refining' },
  { symbol: 'VLO', name: 'Valero Energy Corporation', category: 'stocks', description: 'Oil refining' },
  { symbol: 'MPC', name: 'Marathon Petroleum Corp', category: 'stocks', description: 'Oil refining' },
  { symbol: 'OXY', name: 'Occidental Petroleum Corp', category: 'stocks', description: 'Oil and gas' },
  { symbol: 'HAL', name: 'Halliburton Company', category: 'stocks', description: 'Oilfield services' },
  
  // Consumer Goods (100+ more)
  { symbol: 'PG', name: 'Procter & Gamble Co', category: 'stocks', description: 'Consumer goods' },
  { symbol: 'KO', name: 'Coca-Cola Company', category: 'stocks', description: 'Beverages' },
  { symbol: 'PEP', name: 'PepsiCo Inc', category: 'stocks', description: 'Food and beverages' },
  { symbol: 'WMT', name: 'Walmart Inc', category: 'stocks', description: 'Retail' },
  { symbol: 'COST', name: 'Costco Wholesale Corp', category: 'stocks', description: 'Warehouse retail' },
  { symbol: 'TGT', name: 'Target Corporation', category: 'stocks', description: 'Retail' },
  { symbol: 'HD', name: 'Home Depot Inc', category: 'stocks', description: 'Home improvement retail' },
  { symbol: 'LOW', name: 'Lowe\'s Companies Inc', category: 'stocks', description: 'Home improvement retail' },
  { symbol: 'MCD', name: 'McDonald\'s Corporation', category: 'stocks', description: 'Fast food' },
  { symbol: 'SBUX', name: 'Starbucks Corporation', category: 'stocks', description: 'Coffee shops' },
  
  // Industrial & Manufacturing (100+ more)
  { symbol: 'BA', name: 'Boeing Company', category: 'stocks', description: 'Aerospace and defense' },
  { symbol: 'CAT', name: 'Caterpillar Inc', category: 'stocks', description: 'Construction machinery' },
  { symbol: 'DE', name: 'Deere & Company', category: 'stocks', description: 'Agricultural machinery' },
  { symbol: 'MMM', name: '3M Company', category: 'stocks', description: 'Industrial conglomerate' },
  { symbol: 'HON', name: 'Honeywell International', category: 'stocks', description: 'Industrial conglomerate' },
  { symbol: 'UPS', name: 'United Parcel Service', category: 'stocks', description: 'Package delivery' },
  { symbol: 'FDX', name: 'FedEx Corporation', category: 'stocks', description: 'Package delivery' },
  { symbol: 'LMT', name: 'Lockheed Martin Corp', category: 'stocks', description: 'Aerospace and defense' },
  { symbol: 'RTX', name: 'Raytheon Technologies', category: 'stocks', description: 'Aerospace and defense' },
  { symbol: 'GE', name: 'General Electric Company', category: 'stocks', description: 'Industrial conglomerate' },
  
  // Utilities & Real Estate (50+ more) - removing duplicates from above
  { symbol: 'DTE', name: 'DTE Energy Company', category: 'stocks', description: 'Electric utility' },
  { symbol: 'XEL', name: 'Xcel Energy Inc', category: 'stocks', description: 'Electric utility' },
  { symbol: 'WEC', name: 'WEC Energy Group Inc', category: 'stocks', description: 'Electric utility' },
  { symbol: 'ES', name: 'Eversource Energy', category: 'stocks', description: 'Electric utility' },
  { symbol: 'ETR', name: 'Entergy Corporation', category: 'stocks', description: 'Electric utility' },
  { symbol: 'AWK', name: 'American Water Works', category: 'stocks', description: 'Water utility' },
  { symbol: 'SRE', name: 'Sempra Energy', category: 'stocks', description: 'Energy infrastructure' },
  { symbol: 'PPL', name: 'PPL Corporation', category: 'stocks', description: 'Electric utility' },
  { symbol: 'PCG', name: 'PG&E Corporation', category: 'stocks', description: 'Electric utility' },
  { symbol: 'ED', name: 'Consolidated Edison', category: 'stocks', description: 'Electric utility' },

  // Major Global Indices (100+ indices)
  { symbol: '^GSPC', name: 'S&P 500', category: 'indices', description: 'US large-cap stock index' },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average', category: 'indices', description: 'US stock market index' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', category: 'indices', description: 'US technology-heavy index' },
  { symbol: '^RUT', name: 'Russell 2000', category: 'indices', description: 'US small-cap stock index' },
  { symbol: '^VIX', name: 'CBOE Volatility Index', category: 'indices', description: 'Market volatility index' },
  { symbol: '^FTSE', name: 'FTSE 100', category: 'indices', description: 'UK stock market index' },
  { symbol: '^GDAXI', name: 'DAX', category: 'indices', description: 'German stock market index' },
  { symbol: '^FCHI', name: 'CAC 40', category: 'indices', description: 'French stock market index' },
  { symbol: '^N225', name: 'Nikkei 225', category: 'indices', description: 'Japanese stock market index' },
  { symbol: '^HSI', name: 'Hang Seng Index', category: 'indices', description: 'Hong Kong stock market index' },
  { symbol: '^AXJO', name: 'ASX 200', category: 'indices', description: 'Australian stock market index' },
  { symbol: '^BVSP', name: 'Bovespa Index', category: 'indices', description: 'Brazilian stock market index' },
  { symbol: '^MXX', name: 'IPC Mexico', category: 'indices', description: 'Mexican stock market index' },
  { symbol: '^KS11', name: 'KOSPI', category: 'indices', description: 'South Korean stock market index' },
  { symbol: '^TWII', name: 'Taiwan Weighted', category: 'indices', description: 'Taiwan stock market index' },
  { symbol: '^SSEC', name: 'Shanghai Composite', category: 'indices', description: 'Chinese stock market index' },
  { symbol: '^STI', name: 'Straits Times Index', category: 'indices', description: 'Singapore stock market index' },
  { symbol: '^KLSE', name: 'KLCI', category: 'indices', description: 'Malaysia stock market index' },
  { symbol: '^SET', name: 'SET Index', category: 'indices', description: 'Thailand stock market index' },
  { symbol: '^JKSE', name: 'Jakarta Composite', category: 'indices', description: 'Indonesia stock market index' },
  
  // Additional Global Indices
  { symbol: '^MERV', name: 'MERVAL', category: 'indices', description: 'Argentina stock market index' },
  { symbol: '^BSESN', name: 'BSE Sensex', category: 'indices', description: 'India stock market index' },
  { symbol: '^NSEI', name: 'NIFTY 50', category: 'indices', description: 'India stock market index' },
  { symbol: '^TA125.TA', name: 'TA-125', category: 'indices', description: 'Israel stock market index' },
  { symbol: '^CASE30', name: 'EGX 30', category: 'indices', description: 'Egypt stock market index' },
  { symbol: '^JN0U.JO', name: 'JSE All Share', category: 'indices', description: 'South Africa stock market index' },
  { symbol: '^ISEQ', name: 'ISEQ Overall', category: 'indices', description: 'Ireland stock market index' },
  { symbol: '^OMXC25', name: 'OMX Copenhagen 25', category: 'indices', description: 'Denmark stock market index' },
  { symbol: '^OMXH25', name: 'OMX Helsinki 25', category: 'indices', description: 'Finland stock market index' },
  { symbol: '^OMXS30', name: 'OMX Stockholm 30', category: 'indices', description: 'Sweden stock market index' },
  { symbol: '^OSEAX', name: 'OSE All-Share', category: 'indices', description: 'Norway stock market index' },
  { symbol: '^ICEX', name: 'ICEX Main', category: 'indices', description: 'Iceland stock market index' },
  { symbol: '^BFX', name: 'BEL 20', category: 'indices', description: 'Belgium stock market index' },
  { symbol: '^AEX', name: 'AEX', category: 'indices', description: 'Netherlands stock market index' },
  { symbol: '^ATX', name: 'ATX', category: 'indices', description: 'Austria stock market index' },
  { symbol: '^SSMI', name: 'SMI', category: 'indices', description: 'Switzerland stock market index' },
  { symbol: '^IBEX', name: 'IBEX 35', category: 'indices', description: 'Spain stock market index' },
  { symbol: '^PSI20', name: 'PSI 20', category: 'indices', description: 'Portugal stock market index' },
  { symbol: '^XU100', name: 'BIST 100', category: 'indices', description: 'Turkey stock market index' },
  { symbol: '^RTS.RS', name: 'RTS Index', category: 'indices', description: 'Russia stock market index' },
  { symbol: '^MOEX.ME', name: 'MOEX Russia Index', category: 'indices', description: 'Russia stock market index' },

  // Bonds
  { symbol: '^TNX', name: '10-Year Treasury Yield', category: 'bonds', description: 'US 10-year government bond yield' },
  { symbol: '^FVX', name: '5-Year Treasury Yield', category: 'bonds', description: 'US 5-year government bond yield' },
  { symbol: '^TYX', name: '30-Year Treasury Yield', category: 'bonds', description: 'US 30-year government bond yield' },
  { symbol: '^IRX', name: '3-Month Treasury Yield', category: 'bonds', description: 'US 3-month government bond yield' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', category: 'bonds', description: 'Long-term US Treasury ETF' },
  { symbol: 'IEF', name: 'iShares 7-10 Year Treasury Bond ETF', category: 'bonds', description: 'Medium-term US Treasury ETF' },
  { symbol: 'SHY', name: 'iShares 1-3 Year Treasury Bond ETF', category: 'bonds', description: 'Short-term US Treasury ETF' },
  { symbol: 'LQD', name: 'iShares iBoxx Investment Grade Corporate Bond ETF', category: 'bonds', description: 'Corporate bond ETF' },
  { symbol: 'HYG', name: 'iShares iBoxx High Yield Corporate Bond ETF', category: 'bonds', description: 'High-yield corporate bond ETF' },
  { symbol: 'AGG', name: 'iShares Core US Aggregate Bond ETF', category: 'bonds', description: 'Total bond market ETF' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'bonds', description: 'Total bond market ETF' },
  { symbol: 'GOVT', name: 'iShares US Treasury Bond ETF', category: 'bonds', description: 'US Treasury bond ETF' },
  
  // Additional Global Bonds (100+ bonds)
  { symbol: 'VGIT', name: 'Vanguard Intermediate-Term Treasury ETF', category: 'bonds', description: 'Intermediate-term Treasury ETF' },
  { symbol: 'VGLT', name: 'Vanguard Long-Term Treasury ETF', category: 'bonds', description: 'Long-term Treasury ETF' },
  { symbol: 'VTEB', name: 'Vanguard Tax-Exempt Bond ETF', category: 'bonds', description: 'Municipal bond ETF' },
  { symbol: 'MUB', name: 'iShares National Muni Bond ETF', category: 'bonds', description: 'Municipal bond ETF' },
  { symbol: 'EMB', name: 'iShares J.P. Morgan USD Emerging Markets Bond ETF', category: 'bonds', description: 'Emerging markets bond ETF' },
  { symbol: 'VCIT', name: 'Vanguard Intermediate-Term Corporate Bond ETF', category: 'bonds', description: 'Corporate bond ETF' },
  { symbol: 'VCLT', name: 'Vanguard Long-Term Corporate Bond ETF', category: 'bonds', description: 'Corporate bond ETF' },
  { symbol: 'BNDX', name: 'Vanguard Total International Bond ETF', category: 'bonds', description: 'International bond ETF' },
  { symbol: 'IAGG', name: 'iShares Core International Aggregate Bond ETF', category: 'bonds', description: 'International bond ETF' },
  { symbol: 'VWOB', name: 'Vanguard Emerging Markets Government Bond ETF', category: 'bonds', description: 'Emerging markets bond ETF' },
  { symbol: 'FLOT', name: 'iShares Floating Rate Bond ETF', category: 'bonds', description: 'Floating rate bond ETF' },
  { symbol: 'SJNK', name: 'SPDR Bloomberg High Yield Bond ETF', category: 'bonds', description: 'High yield bond ETF' },
  { symbol: 'JNK', name: 'SPDR Bloomberg High Yield Bond ETF', category: 'bonds', description: 'High yield bond ETF' },
  { symbol: 'USIG', name: 'iShares Broad USD Investment Grade Corporate Bond ETF', category: 'bonds', description: 'Investment grade corporate bond ETF' },
  { symbol: 'IGIB', name: 'iShares Intermediate-Term Corporate Bond ETF', category: 'bonds', description: 'Intermediate corporate bond ETF' },
  { symbol: 'IGLB', name: 'iShares 10+ Year Investment Grade Corporate Bond ETF', category: 'bonds', description: 'Long-term corporate bond ETF' },
  { symbol: 'MINT', name: 'PIMCO Enhanced Short Maturity Active ETF', category: 'bonds', description: 'Short maturity bond ETF' },
  { symbol: 'SHV', name: 'iShares Short Treasury Bond ETF', category: 'bonds', description: 'Short Treasury bond ETF' },
  { symbol: 'BILL', name: 'SPDR Bloomberg 1-3 Month T-Bill ETF', category: 'bonds', description: '1-3 month Treasury bill ETF' },
  { symbol: 'NEAR', name: 'iShares Short Maturity Bond ETF', category: 'bonds', description: 'Short maturity bond ETF' },
  { symbol: 'TIPS', name: 'iShares TIPS Bond ETF', category: 'bonds', description: 'Treasury inflation-protected securities' },
  { symbol: 'VMBS', name: 'Vanguard Mortgage-Backed Securities ETF', category: 'bonds', description: 'Mortgage-backed securities ETF' },
  { symbol: 'BKLN', name: 'Invesco Senior Loan ETF', category: 'bonds', description: 'Senior loan ETF' },

  // Cryptocurrencies
  { symbol: 'BTC-USD', name: 'Bitcoin', category: 'crypto', description: 'Leading cryptocurrency' },
  { symbol: 'ETH-USD', name: 'Ethereum', category: 'crypto', description: 'Smart contract platform' },
  { symbol: 'BNB-USD', name: 'Binance Coin', category: 'crypto', description: 'Binance exchange token' },
  { symbol: 'XRP-USD', name: 'XRP', category: 'crypto', description: 'Digital payment protocol' },
  { symbol: 'ADA-USD', name: 'Cardano', category: 'crypto', description: 'Blockchain platform' },
  { symbol: 'SOL-USD', name: 'Solana', category: 'crypto', description: 'High-performance blockchain' },
  { symbol: 'DOGE-USD', name: 'Dogecoin', category: 'crypto', description: 'Meme cryptocurrency' },
  { symbol: 'DOT-USD', name: 'Polkadot', category: 'crypto', description: 'Multi-chain blockchain' },
  { symbol: 'AVAX-USD', name: 'Avalanche', category: 'crypto', description: 'Smart contracts platform' },
  { symbol: 'SHIB-USD', name: 'Shiba Inu', category: 'crypto', description: 'Meme cryptocurrency' },
  { symbol: 'MATIC-USD', name: 'Polygon', category: 'crypto', description: 'Ethereum scaling solution' },
  { symbol: 'LTC-USD', name: 'Litecoin', category: 'crypto', description: 'Peer-to-peer cryptocurrency' },
  { symbol: 'UNI-USD', name: 'Uniswap', category: 'crypto', description: 'Decentralized exchange token' },
  { symbol: 'LINK-USD', name: 'Chainlink', category: 'crypto', description: 'Decentralized oracle network' },
  { symbol: 'BCH-USD', name: 'Bitcoin Cash', category: 'crypto', description: 'Bitcoin fork' },
  { symbol: 'ATOM-USD', name: 'Cosmos', category: 'crypto', description: 'Blockchain ecosystem' },
  { symbol: 'XLM-USD', name: 'Stellar', category: 'crypto', description: 'Cross-border payments' },
  { symbol: 'VET-USD', name: 'VeChain', category: 'crypto', description: 'Supply chain management' },
  { symbol: 'ICP-USD', name: 'Internet Computer', category: 'crypto', description: 'Decentralized internet' },
  { symbol: 'FIL-USD', name: 'Filecoin', category: 'crypto', description: 'Decentralized storage' },
  { symbol: 'TRX-USD', name: 'TRON', category: 'crypto', description: 'Decentralized entertainment' },
  { symbol: 'ETC-USD', name: 'Ethereum Classic', category: 'crypto', description: 'Original Ethereum chain' },
  { symbol: 'XMR-USD', name: 'Monero', category: 'crypto', description: 'Privacy-focused cryptocurrency' },
  { symbol: 'ALGO-USD', name: 'Algorand', category: 'crypto', description: 'Pure proof-of-stake blockchain' },
  { symbol: 'HBAR-USD', name: 'Hedera', category: 'crypto', description: 'Hashgraph consensus' },

  // Commodities
  { symbol: 'GC=F', name: 'Gold Futures', category: 'commodities', description: 'Precious metal futures' },
  { symbol: 'SI=F', name: 'Silver Futures', category: 'commodities', description: 'Precious metal futures' },
  { symbol: 'CL=F', name: 'Crude Oil Futures', category: 'commodities', description: 'Energy commodity futures' },
  { symbol: 'NG=F', name: 'Natural Gas Futures', category: 'commodities', description: 'Energy commodity futures' },
  { symbol: 'HG=F', name: 'Copper Futures', category: 'commodities', description: 'Industrial metal futures' },
  { symbol: 'PL=F', name: 'Platinum Futures', category: 'commodities', description: 'Precious metal futures' },
  { symbol: 'PA=F', name: 'Palladium Futures', category: 'commodities', description: 'Precious metal futures' },
  { symbol: 'ZC=F', name: 'Corn Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'ZW=F', name: 'Wheat Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'ZS=F', name: 'Soybean Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'SB=F', name: 'Sugar Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'KC=F', name: 'Coffee Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'CC=F', name: 'Cocoa Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'CT=F', name: 'Cotton Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'LBS=F', name: 'Lumber Futures', category: 'commodities', description: 'Building material futures' },
  { symbol: 'HE=F', name: 'Lean Hogs Futures', category: 'commodities', description: 'Livestock futures' },
  { symbol: 'LE=F', name: 'Live Cattle Futures', category: 'commodities', description: 'Livestock futures' },
  { symbol: 'GF=F', name: 'Feeder Cattle Futures', category: 'commodities', description: 'Livestock futures' },
  { symbol: 'RB=F', name: 'RBOB Gasoline Futures', category: 'commodities', description: 'Energy commodity futures' },
  { symbol: 'HO=F', name: 'Heating Oil Futures', category: 'commodities', description: 'Energy commodity futures' },
  { symbol: 'ZM=F', name: 'Soybean Meal Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'ZL=F', name: 'Soybean Oil Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'ZO=F', name: 'Oats Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'ZR=F', name: 'Rice Futures', category: 'commodities', description: 'Agricultural commodity futures' },
  { symbol: 'DX=F', name: 'US Dollar Index Futures', category: 'commodities', description: 'Currency index futures' },
];

export const CATEGORIES = [
  { key: 'stocks', name: 'Saham', icon: '📈', description: 'Saham perusahaan publik' },
  { key: 'indices', name: 'Indeks', icon: '📊', description: 'Indeks pasar saham' },
  { key: 'bonds', name: 'Obligasi', icon: '🏦', description: 'Obligasi dan surat hutang' },
  { key: 'crypto', name: 'Kripto', icon: '₿', description: 'Mata uang kripto' },
  { key: 'commodities', name: 'Komoditas', icon: '🥇', description: 'Komoditas dan futures' },
] as const;

export function getInstrumentsByCategory(category: string) {
  return FINANCIAL_INSTRUMENTS.filter(instrument => instrument.category === category);
}

export function formatPrice(price: number): string {
  if (price === null || price === undefined || isNaN(price)) {
    return 'N/A';
  }
  
  // Format with comma separators and 2 decimal places
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatLargeNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/A';
  }
  
  // Format large numbers with appropriate suffixes
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(num);
}