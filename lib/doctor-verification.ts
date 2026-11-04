/**
 * Doctor verification helpers (demo).
 *
 * Mirrors backend Requirement 18: unverified -> pending_review -> approved / rejected.
 * `changes_requested` is a demo-only softer outcome so founders can see the
 * "please fix your documents" alert. Alerts are modelled as notices carrying the
 * channels they would be delivered on; WhatsApp/email delivery is simulated.
 */
import type {
  DoctorNotice,
  DoctorProfile,
  DoctorVerification,
  VerificationStatus,
} from './mock-data'

export const STATUS_LABEL: Record<VerificationStatus, string> = {
  pending_review: 'Under review',
  changes_requested: 'Changes requested',
  approved: 'Approved',
  rejected: 'Not approved',
}

export function makeNotice(
  kind: DoctorNotice['kind'],
  title: string,
  body: string,
  channels: DoctorNotice['channels'] = ['in_app', 'whatsapp', 'email'],
): DoctorNotice {
  return {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    kind,
    title,
    body,
    channels,
    read: false,
  }
}

export function submissionNotice(resubmitted: boolean): DoctorNotice {
  return makeNotice(
    'info',
    resubmitted ? 'Documents resubmitted' : 'Application received',
    resubmitted
      ? 'Thanks for the update. Our team will review your documents again and let you know here.'
      : 'Our team is verifying your registration and documents. This usually takes 1 to 2 working days. We will alert you here and on WhatsApp.',
  )
}

type Decision = 'approve' | 'request_changes' | 'reject'

/** Demo-only stand-in for the CEO-office admin action. */
export function applyAdminDecision(
  doctor: DoctorProfile,
  decision: Decision,
  note: string,
): DoctorProfile {
  const v = doctor.verification
  if (!v) return doctor
  const trimmed = note.trim()
  let status: VerificationStatus
  let notice: DoctorNotice
  if (decision === 'approve') {
    status = 'approved'
    notice = makeNotice(
      'success',
      'You are approved',
      'Your profile is verified and now visible to parents. Set your availability to start receiving bookings.',
    )
  } else if (decision === 'request_changes') {
    status = 'changes_requested'
    notice = makeNotice(
      'action',
      'Action needed on your documents',
      trimmed || 'Please re-upload a clearer copy of your documents and resubmit.',
    )
  } else {
    status = 'rejected'
    notice = makeNotice(
      'error',
      'Application not approved',
      (trimmed || 'We could not verify your registration details.') +
        ' You can correct your details and resubmit for another review.',
    )
  }
  const next: DoctorVerification = {
    ...v,
    status,
    reviewedAt: new Date().toISOString(),
    reviewNote: trimmed || undefined,
    notices: [notice, ...v.notices],
  }
  return { ...doctor, verification: next }
}

export function unreadNoticeCount(doctor: DoctorProfile): number {
  return doctor.verification?.notices.filter((n) => !n.read).length ?? 0
}
