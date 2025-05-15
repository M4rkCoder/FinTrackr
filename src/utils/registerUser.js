import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";

export default async function registerUser() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("유저 정보를 가져오지 못했습니다:", userError?.message);
    return;
  }
  const userId = user.id;
  const userEmail = user.email;
  const userName = user.user_metadata.full_name;
  const userAvatar = user.user_metadata.picture;

  // Step 1: 이미 존재하는 유저인지 확인
  const { data: existingUser, error: checkUserError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (checkUserError) {
    console.error("유저 조회 실패:", checkUserError);
    return;
  }

  if (!existingUser) {
    // Step 2: 우선 users 테이블에 최소 정보로 insert (account_id 없이)
    const { error: insertUserError } = await supabase.from("users").insert([
      {
        id: userId,
        email: userEmail,
        name: userName,
        account_id: null, // 우선 null 또는 생략
        avatar_url: userAvatar,
      },
    ]);

    if (insertUserError) {
      console.error("유저 추가 실패:", insertUserError);
      return;
    }

    // Step 3: account_id 생성
    const newAccountId = uuidv4();
    const newAccountName = prompt("가계부 이름은?");

    // Step 4: accounts 테이블에 insert (owner_id로 방금 만든 유저 id 사용)
    const { error: insertAccountError } = await supabase
      .from("accounts")
      .insert([
        {
          id: newAccountId,
          owner_id: userId,
          name: newAccountName,
        },
      ]);

    if (insertAccountError) {
      console.error("계정 생성 실패:", insertAccountError);
      return;
    }

    // Step 5: users 테이블의 account_id 업데이트
    const { error: updateUserError } = await supabase
      .from("users")
      .update({ account_id: newAccountId })
      .eq("id", userId);

    if (updateUserError) {
      console.error("유저 계정 ID 업데이트 실패:", updateUserError);
      return;
    }

    console.log("유저와 계정 등록 완료!");
  } else {
    console.log("이미 등록된 유저입니다.");
  }
}
