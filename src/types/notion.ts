export interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any; // For now, we'll keep this flexible
}

export interface NotionPage {
  id: string;
  properties: {
    Name: { title: Array<{ plain_text: string }> };
    Description?: { rich_text: Array<{ plain_text: string }> };
    'Short Description'?: { rich_text: Array<{ plain_text: string }> };
    Type?: { select: { name: string } };
    Technologies?: { multi_select: Array<{ id: string; name: string }> };
    'AI keywords'?: { multi_select: Array<{ name: string }> };
    Slug?: { rich_text: Array<{ plain_text: string }> };
  };
  cover?: {
    external?: { url: string };
    file?: { url: string };
  };
}

export interface ProjectTechnology {
  id: string;
  name: string;
  color?: string;
}

export interface ProjectDetails {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  type?: string;
  technologies: ProjectTechnology[];
  aiKeywords: string[];
  slug: string;
} 