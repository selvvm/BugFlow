import authOptions from "@/app/auth/authOptions";
import { patchIssueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Handle PATCH request to update an issue
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get the current session
  const session = await getServerSession(authOptions);
  
  // If there is no valid session, return a 401 Unauthorized response
  if (!session) return NextResponse.json({}, { status: 401 });

  // Parse the request body
  const body = await request.json();

  // Validate the request body against the patchIssueSchema
  const validation = patchIssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), {
      status: 400, // Return a 400 Bad Request response if validation fails
    });

  const { assignedToUserId, title, description } = body;

  // If assignedToUserId is provided, check if the user exists
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    });
    if (!user)
      return NextResponse.json(
        { error: "Invalid user." }, // Return a 400 response if the user is not found
        { status: 400 }
      );
  }

  // Fetch the issue by ID
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  
  // If the issue is not found, return a 404 Not Found response
  if (!issue)
    return NextResponse.json(
      { error: "Invalid issue" },
      { status: 404 }
    );

  // Update the issue with the provided data
  const updatedIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      title,
      description,
      assignedToUserId,
    },
  });

  // Return the updated issue as a JSON response
  return NextResponse.json(updatedIssue);
}

// Handle DELETE request to delete an issue
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get the current session
  const session = await getServerSession(authOptions);
  
  // If there is no valid session, return a 401 Unauthorized response
  if (!session) return NextResponse.json({}, { status: 401 });

  // Fetch the issue by ID
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  // If the issue is not found, return a 404 Not Found response
  if (!issue)
    return NextResponse.json(
      { error: "Invalid issue" },
      { status: 404 }
    );

  // Delete the issue from the database
  await prisma.issue.delete({
    where: { id: issue.id },
  });

  // Return an empty response to indicate successful deletion
  return NextResponse.json({});
}
