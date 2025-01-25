export interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any; // For now, allow any additional properties
}

export interface NotionPage {
  id: string;
  properties: {
    [key: string]: any; // For now, allow any additional properties
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  status: string;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  slug: string;
  type: string;
} 