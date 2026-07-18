export default function sitemap() {
  return [
    {
      url: "https://easy2convert.xyz",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://easy2convert.xyz/calculators",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
