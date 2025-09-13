import { NextRequest, NextResponse } from 'next/server';
import skillNormalizer from '@/lib/skills';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skillsParam = searchParams.get('skills');
    
    if (!skillsParam) {
      return NextResponse.json({
        success: false,
        error: 'Skills parameter is required'
      }, { status: 400 });
    }

    const skills = skillsParam.split(',').map(s => s.trim());
    const normalizedSkills = await skillNormalizer.normalizeSkills(skills);
    const expandedSkills = skillNormalizer.getExpandedSkills(normalizedSkills);
    const stats = skillNormalizer.getSkillStats();

    return NextResponse.json({
      success: true,
      data: {
        input: skills,
        normalized: normalizedSkills,
        expanded: expandedSkills,
        stats
      }
    });
  } catch (error: any) {
    console.error('Test skills API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
