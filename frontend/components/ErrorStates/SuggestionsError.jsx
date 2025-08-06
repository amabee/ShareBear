import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const SuggestionsError = ({ refetch }) => {
  return (
    <div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Suggested for you
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-sm text-muted-foreground text-center py-4">
            Failed to load suggestions
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="ml-2"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionsError;
