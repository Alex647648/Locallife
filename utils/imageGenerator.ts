/**
 * 根据卡片内容自动生成配图URL
 * 使用Unsplash Source API根据关键词生成相关图片
 */

interface CardData {
  title: string;
  description?: string;
  category: string;
  location?: string;
}

/**
 * 根据类别映射到图片搜索关键词
 */
function getImageKeywords(category: string, title: string, description?: string): string {
  const categoryMap: { [key: string]: string[] } = {
    'Culinary': ['thai food', 'cooking', 'chef', 'restaurant', 'cuisine', 'kitchen'],
    'Wellness': ['yoga', 'meditation', 'massage', 'spa', 'wellness', 'fitness', 'health'],
    'Education': ['learning', 'classroom', 'teaching', 'education', 'study', 'workshop'],
    'Tours': ['travel', 'tour', 'sightseeing', 'adventure', 'explore', 'tourism'],
    'Digital': ['technology', 'digital', 'online', 'computer', 'virtual', 'tech']
  };

  // 从标题和描述中提取关键词
  const text = `${title} ${description || ''}`.toLowerCase();
  
  // 检查类别关键词
  const categoryKeywords = categoryMap[category] || ['chiang mai', 'thailand'];
  
  // 尝试从文本中提取具体的关键词
  const keywords = [
    // 食物相关
    ...(text.match(/\b(cooking|chef|food|restaurant|cuisine|kitchen|meal|dish|recipe|thai food|curry|noodle|rice|soup)\b/gi) || []),
    // 健康相关
    ...(text.match(/\b(yoga|meditation|massage|spa|wellness|fitness|health|therapy|relax|stretch)\b/gi) || []),
    // 教育相关
    ...(text.match(/\b(class|course|lesson|learn|teach|workshop|training|tutorial|education)\b/gi) || []),
    // 旅游相关
    ...(text.match(/\b(tour|travel|trip|guide|sightseeing|adventure|explore|visit|journey)\b/gi) || []),
    // 数字相关
    ...(text.match(/\b(digital|online|virtual|remote|web|tech|software|app|website)\b/gi) || []),
    // 地点相关
    ...(text.match(/\b(chiang mai|thailand|temple|mountain|river|jungle|beach|city)\b/gi) || [])
  ];

  // 如果找到了具体关键词，使用第一个
  if (keywords.length > 0) {
    return keywords[0].trim();
  }

  // 否则使用类别默认关键词
  return categoryKeywords[0];
}

/**
 * 生成Unsplash图片URL
 * 使用Unsplash Source API，根据关键词生成相关图片
 */
export function generateImageUrl(data: CardData): string {
  const keyword = getImageKeywords(data.category, data.title, data.description);
  
  // 编码关键词，支持多词搜索
  const encodedKeyword = encodeURIComponent(keyword);
  
  // 使用featured API获取高质量图片，尺寸800x600适合卡片显示
  return `https://source.unsplash.com/featured/800x600/?${encodedKeyword},chiang mai`;
}

/**
 * 为服务卡片生成图片URL
 */
export function generateServiceImageUrl(service: {
  title: string;
  description?: string;
  category: string;
  location?: string;
}): string {
  return generateImageUrl(service);
}

/**
 * 为需求卡片生成图片URL（如果需要）
 */
export function generateDemandImageUrl(demand: {
  title: string;
  description?: string;
  category: string;
  location?: string;
}): string {
  return generateImageUrl(demand);
}

/**
 * 根据类别获取默认图片URL（备用方案）
 */
export function getDefaultImageUrl(category: string): string {
  const defaultImages: { [key: string]: string } = {
    'Culinary': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    'Wellness': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    'Education': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    'Tours': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
    'Digital': 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop'
  };
  
  return defaultImages[category] || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop';
}
