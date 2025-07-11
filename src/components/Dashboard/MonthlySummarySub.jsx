import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function MonthlySummarySub({ description, value }) {
  return (
    <Card className="">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value.toLocaleString()}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
