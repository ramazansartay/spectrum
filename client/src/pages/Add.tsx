import { Link } from "wouter";

export function AddPage() {
  return (
    <div className="container-custom my-10">
      <h1 className="text-3xl font-bold">Post an Ad</h1>
      <p className="text-gray-500">Fill out the form below to create a new listing.</p>

      <div className="mt-8 p-8 border rounded-lg bg-gray-50">
        <p>Form will go here...</p>
        <Link href="/">
          <a className="text-primary hover:underline mt-4 inline-block">Go back</a>
        </Link>
      </div>
    </div>
  );
}
