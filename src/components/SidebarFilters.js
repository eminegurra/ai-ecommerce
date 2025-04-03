'use client';

export default function SidebarFilters() {
  return (
    <aside className="w-full sm:w-64 p-4 border-r">
      <h2 className="text-lg font-bold mb-4">Filters</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Categories</h3>
        <label><input type="checkbox" /> Supplements</label><br />
        <label><input type="checkbox" /> Tech</label><br />
        <label><input type="checkbox" /> Wellness</label>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Price Range</h3>
        <input type="range" min="0" max="200" />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Brand</h3>
        <label><input type="checkbox" /> HealthCo</label><br />
        <label><input type="checkbox" /> SmartTech</label>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Rating</h3>
        <label><input type="radio" name="rating" /> ★★★★★</label><br />
        <label><input type="radio" name="rating" /> ★★★★☆</label>
      </div>
    </aside>
  );
}
