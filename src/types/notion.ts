export interface NotionRichText {
  type: 'text' | 'mention' | 'equation';
  text?: {
    content: string;
    link: string | null;
  };
  plain_text: string;
  href: string | null;
}

export interface NotionTitle {
  type: 'title';
  title: NotionRichText[];
}

export interface NotionRichTextProperty {
  type: 'rich_text';
  rich_text: NotionRichText[];
}

export interface NotionSelect {
  id: string;
  name: string;
  color: string;
}

export interface NotionSelectProperty {
  type: 'select';
  select: NotionSelect | null;
}

export interface NotionMultiSelect {
  type: 'multi_select';
  multi_select: NotionSelect[];
}

export interface NotionCover {
  type: 'external' | 'file';
  external?: { url: string };
  file?: { url: string };
}

export interface NotionProperties {
  Name: NotionTitle;
  'Short Description': NotionRichTextProperty;
  Description: NotionRichTextProperty;
  Type: NotionSelectProperty;
  Technologies: NotionMultiSelect;
  Slug: NotionRichTextProperty;
  [key: string]: any; // For other properties we haven't typed yet
}

export interface NotionPage {
  id: string;
  cover: {
    external?: { url: string };
    file?: { url: string };
  };
  properties: {
    Name: {
      title: Array<{
        plain_text: string;
      }>;
    };
    'Short Description': {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
    Slug: {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
    Type: {
      select: {
        name: string;
        color: string;
      };
    };
    Technologies: {
      multi_select: Array<{
        id: string;
        name: string;
        color: string;
      }>;
    };
    [key: string]: any;
  };
}

export interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
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