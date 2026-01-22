import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TutorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  selectedGrade: string;
  onGradeChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
}

const subjects = ['All Subjects', 'Mathematics', 'Physical Science', 'Life Sciences', 'English', 'Afrikaans', 'Accounting', 'Business Studies', 'History', 'Geography'];
const grades = ['All Grades', '10', '11', '12'];
const priceRanges = ['All Prices', 'Under R300', 'R300 - R500', 'R500 - R800', 'Over R800'];

export function TutorFilters({
  searchTerm,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedGrade,
  onGradeChange,
  priceRange,
  onPriceRangeChange,
}: TutorFiltersProps) {
  const hasActiveFilters =
    searchTerm ||
    selectedSubject !== 'All Subjects' ||
    selectedGrade !== 'All Grades' ||
    priceRange !== 'All Prices';

  const activeFilterCount = [
    searchTerm ? 1 : 0,
    selectedSubject !== 'All Subjects' ? 1 : 0,
    selectedGrade !== 'All Grades' ? 1 : 0,
    priceRange !== 'All Prices' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearAllFilters = () => {
    onSearchChange('');
    onSubjectChange('All Subjects');
    onGradeChange('All Grades');
    onPriceRangeChange('All Prices');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tutors or classes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => onSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGrade} onValueChange={onGradeChange}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade === 'All Grades' ? grade : `Grade ${grade}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="gap-2"
          >
            <X className="h-3 w-3" />
            Clear All
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
}
