import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface SectionCardProps {
  section: Section;
}

export const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {section.name}
        </CardTitle>
        <Badge variant="secondary">{section.rule}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {section.matches && section.matches.length > 0 ? (
            section.matches.map((match, index) => (
              <div
                key={match.id}
                className={`flex flex-col space-y-1 border-b pb-2 last:border-0 last:pb-0 p-2 rounded-md ${index === 0 ? 'bg-accent/50 border-accent' : ''}`}
              >
                <span className="text-sm font-medium truncate" title={match.value}>
                  {match.value}
                </span>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>First: {new Date(match.first_seen_at).toLocaleTimeString()}</span>
                  <span>Last: {new Date(match.last_seen_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No matches found yet.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
