import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddSpanRuleDialogProps {
    onAdd: (name: string, startsWith: string, followedBy: string) => Promise<void>;
}

export const AddSpanRuleDialog: React.FC<AddSpanRuleDialogProps> = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [startsWith, setStartsWith] = useState('');
    const [followedBy, setFollowedBy] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAdd(name, startsWith, followedBy);
            setOpen(false);
            setName('');
            setStartsWith('');
            setFollowedBy('');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Span Rule</DialogTitle>
                        <DialogDescription>
                            Define a rule to extract a specific part of the log line.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startsWith" className="text-right">
                                Starts with
                            </Label>
                            <Input
                                id="startsWith"
                                value={startsWith}
                                onChange={(e) => setStartsWith(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="followedBy" className="text-right">
                                Followed by
                            </Label>
                            <Input
                                id="followedBy"
                                value={followedBy}
                                onChange={(e) => setFollowedBy(e.target.value)}
                                className="col-span-3"
                                placeholder="(Optional)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Rule'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
