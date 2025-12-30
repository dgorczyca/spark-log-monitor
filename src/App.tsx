import { useEffect, useState } from 'react';
import { SectionCard } from './components/SectionCard';
import { AddSectionDialog } from './components/AddSectionDialog';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface Match {
  id: number;
  value: string;
  first_seen_at: string;
  last_seen_at: string;
}

interface Section {
  id: number;
  name: string;
  rule: string;
  matches: Match[];
}

function App() {
  const [sections, setSections] = useState<Section[]>([]);

  const fetchSections = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sections');
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    }
  };

  useEffect(() => {
    fetchSections();
    const interval = setInterval(fetchSections, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAddSection = async (name: string, rule: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, rule }),
      });

      if (response.ok) {
        toast.success("Section added successfully");
        fetchSections();
      } else {
        toast.error("Failed to add section");
      }
    } catch (error) {
      toast.error("Error adding section");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Log Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor log streams for specific patterns.
            </p>
          </div>
          <AddSectionDialog onAdd={handleAddSection} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>

        {sections.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No sections found. Add one to start monitoring.
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;