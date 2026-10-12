/**
 * Shared section heading used across homepage sections so every section title
 * stays visually consistent. Edit the classes here once to update them all.
 */
export function SectionHeading({ title }) {
  return (
    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight pb-4 mb-6 border-b border-black">
      {title}
    </h2>
  );
}

export default SectionHeading;
