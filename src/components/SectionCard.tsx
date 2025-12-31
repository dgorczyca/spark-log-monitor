import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddSpanRuleDialog } from './AddSpanRuleDialog';
import { toast } from "sonner";
import { X } from "lucide-react";

interface Match {
  id: number;
  value: string;
  first_seen_at: string;
  last_seen_at: string;
}

interface SpanRule {
  id: number;
  name: string;
  starts_with: string;
  followed_by: string;
}

interface Section {
  id: number;
  name: string;
  rule: string;
  matches: Match[];
  span_rules: SpanRule[];
}

interface SectionCardProps {
  section: Section;
  onUpdate: () => Promise<void>;
}

export const SectionCard: React.FC<SectionCardProps> = ({ section, onUpdate }) => {
  const handleAddSpanRule = async (name: string, startsWith: string, followedBy: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/sections/${section.id}/span-rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, startsWith, followedBy }),
      });

      if (response.ok) {
        toast.success("Span rule added successfully");
        await onUpdate();
      } else {
        toast.error("Failed to add span rule");
      }
    } catch (error) {
      toast.error("Error adding span rule");
      console.error(error);
    }
  };

  const handleDeleteSpanRule = async (ruleId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/span-rules/${ruleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Span rule deleted successfully");
        await onUpdate();
      } else {
        toast.error("Failed to delete span rule");
      }
    } catch (error) {
      toast.error("Error deleting span rule");
      console.error(error);
    }
  };

  const parseLogLine = (line: string, rules: SpanRule[]) => {
    if (!rules || rules.length === 0) return null;

    const spans = rules.map(rule => {
      const startIndex = line.indexOf(rule.starts_with);
      if (startIndex === -1) return null;

      const valueStartIndex = startIndex + rule.starts_with.length;
      let value = "";

      if (rule.followed_by) {
        const endIndex = line.indexOf(rule.followed_by, valueStartIndex);
        if (endIndex !== -1) {
          value = line.substring(valueStartIndex, endIndex);
        }
      } else {
        value = line.substring(valueStartIndex);
      }

      if (value) {
        return { name: rule.name, value: value.trim(), ruleId: rule.id };
      }
      return null;
    }).filter(Boolean);

    return spans.length > 0 ? spans : null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">
            {section.name}
          </CardTitle>
          <Badge variant="secondary">{section.rule}</Badge>
        </div>
        <AddSpanRuleDialog onAdd={handleAddSpanRule} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {section.matches && section.matches.length > 0 ? (
            section.matches.map((match, index) => {
              const parsedSpans = parseLogLine(match.value, section.span_rules);

              return (
                <div
                  key={match.id}
                  className={`flex flex-col space-y-1 border-b pb-2 last:border-0 last:pb-0 p-2 rounded-md ${index === 0 ? 'bg-accent/50 border-accent' : ''}`}
                >
                  {parsedSpans ? (
                    <div className="flex flex-wrap gap-2">
                      {parsedSpans.map((span, i) => (
                        <Badge key={i} variant="outline" className="text-xs flex items-center gap-1 group">
                          <span className="font-semibold">{span?.name}:</span>
                          {span?.value}
                          <button
                            onClick={() => span?.ruleId && handleDeleteSpanRule(span.ruleId)}
                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive focus:opacity-100"
                            title="Remove rule"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm font-medium truncate" title={match.value}>
                      {match.value}
                    </span>
                  )}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>First: {new Date(match.first_seen_at).toLocaleTimeString()}</span>
                    <span>Last: {new Date(match.last_seen_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-muted-foreground">No matches found yet.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
