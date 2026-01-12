import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tutors or classes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
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
      </div>
    </div>
  );
}
