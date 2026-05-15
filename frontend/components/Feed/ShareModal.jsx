"use client";
import { useState } from "react";
import { useSharePost, useUnsharePost } from "@/hooks/usePosts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Share } from "lucide-react";

export default function ShareModal({ postId, shared, open, onOpenChange }) {
  const [caption, setCaption] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState("PUBLIC");

  const sharePost = useSharePost();
  const unsharePost = useUnsharePost();

  const isPending = sharePost.isPending || unsharePost.isPending;

  const handleShare = () => {
    sharePost.mutate(
      { postId, caption, privacyLevel },
      { onSuccess: () => { setCaption(""); onOpenChange(false); } }
    );
  };

  const handleUnshare = () => {
    unsharePost.mutate(postId, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            {shared ? "Remove Share" : "Share Post"}
          </DialogTitle>
        </DialogHeader>

        {shared ? (
          <p className="text-sm text-muted-foreground">
            Remove your share of this post?
          </p>
        ) : (
          <div className="space-y-3">
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption (optional)…"
              maxLength={500}
              rows={3}
              className="resize-none text-sm"
            />

            <Select value={privacyLevel} onValueChange={setPrivacyLevel}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Who can see this?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Everyone</SelectItem>
                <SelectItem value="FRIENDS">Friends only</SelectItem>
                <SelectItem value="PRIVATE">Only me</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>

          {shared ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleUnshare}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove Share"}
            </Button>
          ) : (
            <Button size="sm" onClick={handleShare} disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Share className="h-4 w-4 mr-1" />
              )}
              Share
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
