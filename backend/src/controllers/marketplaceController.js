import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get list of supported marketplaces and their UI styling metadata
 * @route   GET /api/marketplaces
 * @access  Public
 */
export const getMarketplaces = asyncHandler(async (req, res) => {
  const marketplaces = [
    {
      id: 'amazon',
      name: 'Amazon',
      icon: '🟠',
      color: 'amber',
      badgeClass: 'bg-amber-50 text-amber-950 border-amber-200',
      tagline: 'Fast delivery & Amazon Prime',
      domain: 'amazon.in',
    },
    {
      id: 'flipkart',
      name: 'Flipkart',
      icon: '🟡',
      color: 'yellow',
      badgeClass: 'bg-yellow-50 text-yellow-950 border-yellow-300',
      tagline: 'Flipkart Assured quality',
      domain: 'flipkart.com',
    },
    {
      id: 'meesho',
      name: 'Meesho',
      icon: '🟣',
      color: 'purple',
      badgeClass: 'bg-purple-50 text-purple-950 border-purple-200',
      tagline: 'Direct manufacturer deals',
      domain: 'meesho.com',
    },
    {
      id: 'myntra',
      name: 'Myntra',
      icon: '🩷',
      color: 'pink',
      badgeClass: 'bg-pink-50 text-pink-950 border-pink-200',
      tagline: 'Fashion & curated lifestyle',
      domain: 'myntra.com',
    },
  ];

  res.status(200).json({
    success: true,
    count: marketplaces.length,
    data: marketplaces,
  });
});
