export const RESUME_DESIGN_GROUPS = [
  {
    style: "classic-pro",
    label: "Classic Pro",
    description: "Single column, formal serif layout",
    variants: [
      {
        id: "classic-pro",
        name: "Black & White",
        tag: "Most Professional",
        tagColor: "#448AFF",
        colors: { primary: "#1a1a1a", accent: "#444", bg: "#ffffff" }
      },
      {
        id: "classic-pro-navy",
        name: "Navy Blue",
        tag: "Corporate",
        tagColor: "#4FC3F7",
        colors: { primary: "#1a3a5f", accent: "#2a5f8f", bg: "#ffffff" }
      },
      {
        id: "classic-pro-green",
        name: "Forest Green",
        tag: "Fresh Look",
        tagColor: "#81C784",
        colors: { primary: "#1a4a1a", accent: "#2d7a2d", bg: "#ffffff" }
      },
      {
        id: "classic-pro-maroon",
        name: "Maroon",
        tag: "Bold & Classic",
        tagColor: "#EF9A9A",
        colors: { primary: "#5a1a1a", accent: "#8b2020", bg: "#ffffff" }
      }
    ]
  },
  {
    style: "modern-split",
    label: "Modern Split",
    description: "Two column sidebar layout",
    variants: [
      {
        id: "modern-split",
        name: "Ocean Blue",
        tag: "Most Popular",
        tagColor: "#00E676",
        colors: { sidebar: "#1e3a5f", accent: "#2196F3", bg: "#f8f9fa" }
      },
      {
        id: "modern-split-purple",
        name: "Royal Purple",
        tag: "Standout",
        tagColor: "#CE93D8",
        colors: { sidebar: "#2d1b5e", accent: "#7c4dff", bg: "#f5f0ff" }
      },
      {
        id: "modern-split-teal",
        name: "Teal",
        tag: "Modern",
        tagColor: "#80DEEA",
        colors: { sidebar: "#1a4a4a", accent: "#00BCD4", bg: "#f0fafa" }
      },
      {
        id: "modern-split-orange",
        name: "Amber",
        tag: "Energetic",
        tagColor: "#FFCC80",
        colors: { sidebar: "#3a2000", accent: "#FF8C00", bg: "#fff8f0" }
      }
    ]
  },
  {
    style: "creative-edge",
    label: "Creative Edge",
    description: "Bold gradient header, badge skills",
    variants: [
      {
        id: "creative-edge",
        name: "Purple Gradient",
        tag: "Eye-Catching",
        tagColor: "#CE93D8",
        colors: { grad1: "#1a237e", grad2: "#7c4dff", accent: "#7c4dff", badge: "#ede7f6", badgeText: "#7c4dff" }
      },
      {
        id: "creative-edge-rose",
        name: "Rose Red",
        tag: "Bold",
        tagColor: "#F48FB1",
        colors: { grad1: "#7b0d1e", grad2: "#e84393", accent: "#e84393", badge: "#fce4ec", badgeText: "#e84393" }
      },
      {
        id: "creative-edge-teal",
        name: "Teal Ocean",
        tag: "Calm & Pro",
        tagColor: "#80CBC4",
        colors: { grad1: "#004d40", grad2: "#00bcd4", accent: "#00bcd4", badge: "#e0f7fa", badgeText: "#00838f" }
      },
      {
        id: "creative-edge-dark",
        name: "Dark Mode",
        tag: "Ultra Modern",
        tagColor: "#90CAF9",
        colors: { grad1: "#0d0d1a", grad2: "#1a237e", accent: "#4fc3f7", badge: "#1a1a3e", badgeText: "#4fc3f7" }
      }
    ]
  },
  {
    style: "minimal-clean",
    label: "Minimal Clean",
    description: "Whitespace-focused, elegant",
    variants: [
      {
        id: "minimal-clean",
        name: "Pure Gray",
        tag: "Clean & Simple",
        tagColor: "#B0B0D0",
        colors: { accent: "#757575", line: "#e0e0e0", bg: "#fafafa", text: "#212121" }
      },
      {
        id: "minimal-clean-blue",
        name: "Sky Blue",
        tag: "Crisp",
        tagColor: "#90CAF9",
        colors: { accent: "#1565C0", line: "#BBDEFB", bg: "#F8FBFF", text: "#0D1B2A" }
      },
      {
        id: "minimal-clean-green",
        name: "Sage Green",
        tag: "Natural",
        tagColor: "#A5D6A7",
        colors: { accent: "#2E7D32", line: "#C8E6C9", bg: "#F5FFF5", text: "#1B2E1B" }
      },
      {
        id: "minimal-clean-gold",
        name: "Warm Gold",
        tag: "Premium",
        tagColor: "#FFD54F",
        colors: { accent: "#8B6914", line: "#F0DCA0", bg: "#FFFDF5", text: "#2C1F00" }
      }
    ]
  }
];

// Flat list for backwards compatibility
export const RESUME_DESIGNS = RESUME_DESIGN_GROUPS.flatMap(g =>
  g.variants.map(v => ({ ...v, layout: g.style, font: "", description: g.description }))
);
