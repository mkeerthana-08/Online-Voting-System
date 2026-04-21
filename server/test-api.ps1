$ErrorActionPreference = 'Stop'
$base = 'http://localhost:5000/api'
$suffix = Get-Random -Maximum 100000

function PostJson {
  param(
    [string]$Url,
    [object]$Body,
    [string]$Token
  )

  $headers = @{}
  if ($Token) {
    $headers.Authorization = "Bearer $($Token)"
  }

  Invoke-RestMethod -Uri $Url -Method Post -Headers $headers -ContentType 'application/json' -Body ($Body | ConvertTo-Json -Depth 5)
}

$adminId = "ADMIN$suffix"
$userId = "USER$suffix"
$partyName = "Unity Party $suffix"

$adminReg = PostJson "$base/auth/register" @{ name = 'Admin User'; email = "admin$suffix@example.com"; phone = '9999999999'; voterId = $adminId; aadhaar = "11112222$suffix"; password = 'Admin@123'; role = 'admin' }
$userReg = PostJson "$base/auth/register" @{ name = 'Normal User'; email = "user$suffix@example.com"; phone = '8888888888'; voterId = $userId; aadhaar = "44445555$suffix"; password = 'User@123'; role = 'user' }

$adminOtp = PostJson "$base/auth/request-otp" @{ voterId = $adminId; password = 'Admin@123' }
$userOtp = PostJson "$base/auth/request-otp" @{ voterId = $userId; password = 'User@123' }

PostJson "$base/auth/verify-otp" @{ voterId = $adminId; otp = $adminOtp.otp } | Out-Null
PostJson "$base/auth/verify-otp" @{ voterId = $userId; otp = $userOtp.otp } | Out-Null

$adminLogin = PostJson "$base/auth/login" @{ voterId = $adminId; password = 'Admin@123' }
$userLogin = PostJson "$base/auth/login" @{ voterId = $userId; password = 'User@123' }

$party = PostJson "$base/parties" @{ name = $partyName; symbol = 'Lotus'; description = 'Test party' } $adminLogin.token
$parties = Invoke-RestMethod -Uri "$base/parties" -Headers @{ Authorization = "Bearer $($userLogin.token)" }
$vote = PostJson "$base/votes" @{ partyId = $party._id } $userLogin.token
$status = Invoke-RestMethod -Uri "$base/votes/me/status" -Headers @{ Authorization = "Bearer $($userLogin.token)" }
$votes = Invoke-RestMethod -Uri "$base/votes" -Headers @{ Authorization = "Bearer $($adminLogin.token)" }
$counts = Invoke-RestMethod -Uri "$base/votes/count" -Headers @{ Authorization = "Bearer $($adminLogin.token)" }

$result = [pscustomobject]@{
  adminRegister = $adminReg.message
  userRegister = $userReg.message
  adminOtp = $adminOtp.otp
  userOtp = $userOtp.otp
  adminRole = $adminLogin.role
  userRole = $userLogin.role
  partyName = $party.name
  partyCount = $parties.Count
  voteMessage = $vote.message
  userHasVoted = $status.hasVoted
  votesCount = $votes.Count
  countForParty = ($counts | Where-Object name -eq $partyName).voteCount
}

$result | ConvertTo-Json -Compress
