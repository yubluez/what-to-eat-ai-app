import PreferencesForm from "@/components/PreferencesForm";

export default function PreferencesPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header matching Mockup 4 */}
      <div className="flex items-center gap-2.5 border-b border-stone-200 pb-4">
        <span className="text-2xl">🍲</span>
        <h1 className="text-xl font-bold text-stone-900">
          กำหนดความต้องการของคุณ
        </h1>
      </div>

      <PreferencesForm />
    </div>
  );
}
