import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { mealDbService } from "../services/mealdb-service";

// Import Shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea?: string; // Added to match RecipeCard props
  strTags?: string; // Added to match RecipeCard props
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perform search when component mounts if there's a query parameter
  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    const { data, error } = await mealDbService.searchByName(query);

    if (error) {
      setError(error);
      setSearchResults([]);
    } else if (!data || data.length === 0) {
      setError("No recipes found. Try a different search term.");
      setSearchResults([]);
    } else {
      setSearchResults(data);
      setError(null);
    }

    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
    performSearch(searchQuery);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">Find something you like</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Loading state with skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden h-full">
              <div className="aspect-video">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-7 w-4/5 mb-2" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Search results */}
      {!loading && searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Search Results ({searchResults.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                id={meal.idMeal}
                title={meal.strMeal}
                image={meal.strMealThumb}
                category={meal.strCategory}
                area={meal.strArea || ""} // Added with fallback
                tags={meal.strTags} // Added
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state when no search has been performed */}
      {!loading && searchResults.length === 0 && !error && !queryParam && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Search for your favorite recipes above to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
